import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { UserRole } from '../../generated/prisma/enums';
import { ROLES_KEY } from './auth.constants';
import type { AuthenticatedRequestUser } from './auth.types';

type RequestWithAuth = {
  authUser?: AuthenticatedRequestUser;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const authUser = request.authUser;

    if (!authUser) {
      throw new ForbiddenException(
        'Authenticated context is required before role check.',
      );
    }

    if (!roles.includes(authUser.role)) {
      throw new ForbiddenException(
        'User role does not grant access to this route.',
      );
    }

    return true;
  }
}
