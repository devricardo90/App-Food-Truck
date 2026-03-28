import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

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
      throw new ForbiddenException(
        'Authenticated context is required before foodtruck membership check.',
      );
    }

    const requestedFoodtruckId = this.getRequestedFoodtruckId(request);
    const activeFoodtruck = this.authService.resolveActiveFoodtruckContext(
      authUser,
      requestedFoodtruckId,
      {
        requireSelection: true,
      },
    );

    if (!activeFoodtruck) {
      throw new ForbiddenException(
        'Authenticated user has no active foodtruck context.',
      );
    }

    if (!roles.includes(activeFoodtruck.role)) {
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
