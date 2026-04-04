import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import {
  type ApiAuthDiagnostic,
  emitApiLog,
  setAuthDiagnostic,
} from '../../common/observability';
import { IS_PUBLIC_KEY } from './auth.constants';
import { AuthService } from './auth.service';
import type { AuthenticatedRequestUser } from './auth.types';

type RequestWithAuth = {
  headers: {
    authorization?: string;
  };
  authUser?: AuthenticatedRequestUser;
  authDiagnostic?: ApiAuthDiagnostic;
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

    try {
      const bearerToken = this.authService.extractBearerToken(
        request.headers.authorization,
      );
      request.authUser =
        await this.authService.authenticateBearerToken(bearerToken);
      setAuthDiagnostic(request, {
        code: 'ok',
        stage: 'auth.guard.authenticateBearerToken',
        detail: null,
      });
      return true;
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : 'Unexpected auth failure.';

      if (error instanceof HttpException) {
        const statusCode = error.getStatus();
        const diagnosticCode =
          request.headers.authorization && statusCode < 500
            ? 'invalid-token'
            : statusCode >= 500
              ? 'internal-error'
              : 'missing-auth';

        setAuthDiagnostic(request, {
          code: diagnosticCode,
          stage: 'auth.guard.authenticateBearerToken',
          detail,
        });

        emitApiLog(
          statusCode >= 500 ? 'error' : 'warn',
          'auth.guard.rejected',
          {
            statusCode,
            diagnosticCode,
            detail,
          },
        );
        throw error;
      }

      setAuthDiagnostic(request, {
        code: 'internal-error',
        stage: 'auth.guard.authenticateBearerToken',
        detail,
      });
      emitApiLog('error', 'auth.guard.unexpected_failure', {
        errorName: error instanceof Error ? error.name : 'UnknownError',
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      throw new UnauthorizedException('Unable to validate Clerk token.');
    }
  }
}
