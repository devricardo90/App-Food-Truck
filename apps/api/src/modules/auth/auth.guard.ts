import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthenticatedRequestUser } from './auth.types';

type RequestWithAuth = {
  headers: {
    authorization?: string;
  };
  authUser?: AuthenticatedRequestUser;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithAuth>();
    const bearerToken = this.authService.extractBearerToken(
      request.headers.authorization,
    );

    try {
      request.authUser =
        await this.authService.authenticateBearerToken(bearerToken);
      return true;
    } catch (error) {
      console.error('AuthGuard bearer authentication failed', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage:
          error instanceof Error ? error.message : String(error),
        isHttpException: error instanceof HttpException,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new UnauthorizedException('Unable to validate Clerk token.');
    }
  }
}
