import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  type ApiAuthDiagnostic,
  emitApiLog,
  setAuthDiagnostic,
} from '../../common/observability';
import type { MembershipRole } from '../../generated/prisma/enums';
import { FOODTRUCK_MEMBERSHIP_ROLES_KEY } from './foodtruck-membership.decorator';
import { AuthService } from './auth.service';
import type {
  AuthMembershipContext,
  AuthenticatedRequestUser,
} from './auth.types';

type RequestWithAuth = {
  headers: Record<string, string | string[] | undefined>;
  authUser?: AuthenticatedRequestUser;
  activeFoodtruck?: AuthMembershipContext;
  authDiagnostic?: ApiAuthDiagnostic;
};

@Injectable()
export class FoodtruckMembershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<MembershipRole[]>(
      FOODTRUCK_MEMBERSHIP_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const authUser = request.authUser;

    if (!authUser) {
      setAuthDiagnostic(request, {
        code: 'missing-auth',
        stage: 'foodtruck-membership.guard.authUser',
        detail:
          'Authenticated context is required before foodtruck membership check.',
      });
      throw new ForbiddenException(
        'Authenticated context is required before foodtruck membership check.',
      );
    }

    const requestedFoodtruckId = this.getRequestedFoodtruckId(request);
    let activeFoodtruck: AuthMembershipContext | null;

    try {
      activeFoodtruck = this.authService.resolveActiveFoodtruckContext(
        authUser,
        requestedFoodtruckId,
        {
          requireSelection: true,
        },
      );
    } catch (error) {
      const detail =
        error instanceof Error
          ? error.message
          : 'Unable to resolve active foodtruck context.';
      const diagnosticCode = detail.includes('multiple foodtruck memberships')
        ? 'foodtruck-selection-required'
        : detail.includes('not available')
          ? 'foodtruck-not-allowed'
          : 'membership-missing';

      setAuthDiagnostic(request, {
        code: diagnosticCode,
        stage: 'foodtruck-membership.guard.resolveActiveFoodtruckContext',
        detail,
      });
      emitApiLog('warn', 'auth.membership.denied', {
        diagnosticCode,
        detail,
        requestedFoodtruckId: requestedFoodtruckId ?? null,
      });
      throw error;
    }

    if (!activeFoodtruck) {
      setAuthDiagnostic(request, {
        code: 'membership-missing',
        stage: 'foodtruck-membership.guard.activeFoodtruck',
        detail: 'Authenticated user has no active foodtruck context.',
      });
      throw new ForbiddenException(
        'Authenticated user has no active foodtruck context.',
      );
    }

    if (!roles.includes(activeFoodtruck.role)) {
      setAuthDiagnostic(request, {
        code: 'role-insufficient',
        stage: 'foodtruck-membership.guard.roleCheck',
        detail: 'Authenticated user lacks foodtruck membership permission.',
      });
      emitApiLog('warn', 'auth.membership.role_insufficient', {
        requiredRoles: roles,
        activeRole: activeFoodtruck.role,
      });
      throw new ForbiddenException(
        'Authenticated user lacks foodtruck membership permission.',
      );
    }

    request.activeFoodtruck = activeFoodtruck;

    return true;
  }

  private getRequestedFoodtruckId(request: RequestWithAuth) {
    const headerValue = request.headers['x-foodtruck-id'];

    if (Array.isArray(headerValue)) {
      return headerValue[0];
    }

    return headerValue;
  }
}
