import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

import { emitApiLog } from '../../common/observability';
import { buildAuthEnvironmentSummary } from '../../config/runtime';
import { FoodtruckMembershipsService } from '../foodtruck-memberships/foodtruck-memberships.service';
import { UsersService } from '../users/users.service';
import type {
  AuthenticatedRequestUser,
  ResolveActiveFoodtruckOptions,
} from './auth.types';
import {
  buildMeContext,
  extractBearerToken,
  parseEnvList,
  resolveActiveFoodtruckContext,
} from './auth.utils';

type ClerkClaims = {
  sub?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
};

function readErrorMetadata(error: unknown) {
  return error instanceof Error
    ? {
        errorName: error.name,
        errorMessage: error.message,
      }
    : {
        errorName: 'UnknownError',
        errorMessage: String(error),
      };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly foodtruckMembershipsService: FoodtruckMembershipsService,
  ) {}

  async authenticateBearerToken(token: string) {
    const secretKey = process.env.CLERK_SECRET_KEY;

    if (!secretKey) {
      throw new InternalServerErrorException(
        'CLERK_SECRET_KEY is required for auth validation.',
      );
    }

    if (secretKey === 'sk_test_example') {
      throw new InternalServerErrorException(
        'CLERK_SECRET_KEY is still using the example placeholder. Configure the real Clerk secret for this environment.',
      );
    }

    const authorizedParties = parseEnvList(
      process.env.CLERK_AUTHORIZED_PARTIES,
    );
    const audience = parseEnvList(process.env.CLERK_AUDIENCE);

    let claims: ClerkClaims;

    try {
      claims = (await verifyToken(token, {
        secretKey,
        jwtKey: process.env.CLERK_JWT_KEY,
        authorizedParties: authorizedParties?.length
          ? authorizedParties
          : undefined,
        audience: audience?.length ? audience : undefined,
      })) as ClerkClaims;
    } catch (error) {
      const validationError =
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
            }
          : {
              name: 'UnknownError',
              message: String(error),
            };

      console.error('Clerk token validation failed', {
        stage: 'verifyToken',
        hasJwtKey: Boolean(process.env.CLERK_JWT_KEY?.trim()),
        hasAudienceConfig: Boolean(audience?.length),
        hasAuthorizedPartiesConfig: Boolean(authorizedParties?.length),
        ...buildAuthEnvironmentSummary(),
        errorName: validationError.name,
        errorMessage: validationError.message,
      });
      emitApiLog('warn', 'auth.token.invalid', {
        stage: 'verifyToken',
        errorName: validationError.name,
        errorMessage: validationError.message,
      });

      throw new UnauthorizedException(
        `Clerk token validation failed: ${validationError.message}`,
      );
    }

    const externalAuthId = claims.sub;

    if (!externalAuthId) {
      console.error('Clerk token claims unexpected', {
        stage: 'verifyTokenClaims',
        subjectPresent: false,
        emailPresent: Boolean(claims.email),
      });
      emitApiLog('warn', 'auth.token.subject_missing', {
        stage: 'verifyTokenClaims',
        subjectPresent: false,
      });
      throw new UnauthorizedException('Clerk token is missing a subject.');
    }

    let user: Awaited<ReturnType<AuthService['syncDomainUser']>>;

    try {
      user = await this.syncDomainUser(externalAuthId, claims);
    } catch (error) {
      const errorMetadata = readErrorMetadata(error);

      console.error('Clerk auth domain sync failed', {
        stage: 'syncDomainUser',
        externalAuthId,
        ...errorMetadata,
      });
      emitApiLog('error', 'auth.domain_sync.failed', {
        stage: 'syncDomainUser',
        externalAuthId,
        ...errorMetadata,
      });
      throw error;
    }

    let memberships: Awaited<
      ReturnType<FoodtruckMembershipsService['listActiveForUser']>
    >;

    try {
      memberships = await this.foodtruckMembershipsService.listActiveForUser(
        user.id,
      );
    } catch (error) {
      const errorMetadata = readErrorMetadata(error);

      console.error('Clerk auth membership lookup failed', {
        stage: 'listActiveForUser',
        userId: user.id,
        ...errorMetadata,
      });
      emitApiLog('error', 'auth.membership_lookup.failed', {
        stage: 'listActiveForUser',
        userId: user.id,
        ...errorMetadata,
      });
      throw error;
    }

    const authUser: AuthenticatedRequestUser = {
      userId: user.id,
      externalAuthId: user.externalAuthId,
      role: user.role,
      email: user.email,
      name: user.name,
      memberships,
      tokenSubject: externalAuthId,
    };

    return authUser;
  }

  extractBearerToken(headerValue: string | undefined) {
    try {
      return extractBearerToken(headerValue);
    } catch (error) {
      const diagnosticCode = headerValue ? 'invalid-token' : 'missing-auth';

      emitApiLog('warn', 'auth.bearer.rejected', {
        stage: 'extractBearerToken',
        diagnosticCode,
        hasHeader: Boolean(headerValue),
        scheme: headerValue?.split(' ')[0] ?? null,
      });
      console.warn('Clerk auth bearer rejected', {
        stage: 'extractBearerToken',
        hasHeader: Boolean(headerValue),
        scheme: headerValue?.split(' ')[0] ?? null,
      });
      throw error;
    }
  }

  resolveActiveFoodtruckContext(
    authUser: AuthenticatedRequestUser,
    requestedFoodtruckId?: string,
    options?: ResolveActiveFoodtruckOptions,
  ): AuthenticatedRequestUser['memberships'][number] | null {
    return resolveActiveFoodtruckContext(
      authUser,
      requestedFoodtruckId,
      options,
    );
  }

  buildMeContext(
    authUser: AuthenticatedRequestUser,
    requestedFoodtruckId?: string,
  ) {
    return buildMeContext(authUser, requestedFoodtruckId);
  }

  private async syncDomainUser(externalAuthId: string, claims: ClerkClaims) {
    const email = claims.email?.trim() || null;
    const phone = claims.phone_number?.trim() || null;
    const name = claims.full_name?.trim() || this.buildName(claims);

    return this.usersService.upsertAuthUser({
      externalAuthId,
      email,
      phone,
      name,
    });
  }

  private buildName(claims: ClerkClaims) {
    const firstName = claims.first_name?.trim();
    const lastName = claims.last_name?.trim();
    const joinedName = [firstName, lastName].filter(Boolean).join(' ').trim();

    return joinedName || null;
  }
}
