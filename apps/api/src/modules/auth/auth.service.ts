import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

import { UserRole } from '../../generated/prisma/enums';
import { FoodtruckMembershipsService } from '../foodtruck-memberships/foodtruck-memberships.service';
import { UsersService } from '../users/users.service';
import type {
  AuthenticatedRequestUser,
  ResolveActiveFoodtruckOptions,
} from './auth.types';

type ClerkClaims = {
  sub?: string;
  email?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
};

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

    const authorizedParties = process.env.CLERK_AUTHORIZED_PARTIES?.split(',')
      .map((party) => party.trim())
      .filter(Boolean);
    const audience = process.env.CLERK_AUDIENCE?.split(',')
      .map((value) => value.trim())
      .filter(Boolean);

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
        tokenPreview: token.slice(0, 16),
        tokenSegments: token.split('.').length,
        hasJwtKey: Boolean(process.env.CLERK_JWT_KEY?.trim()),
        audience: audience?.length ? audience : null,
        authorizedParties: authorizedParties?.length
          ? authorizedParties
          : null,
        errorName: validationError.name,
        errorMessage: validationError.message,
      });

      throw error;
    }

    const externalAuthId = claims.sub;

    if (!externalAuthId) {
      throw new UnauthorizedException('Clerk token is missing a subject.');
    }

    const user = await this.syncDomainUser(externalAuthId, claims);
    const memberships =
      await this.foodtruckMembershipsService.listActiveForUser(user.id);

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
    if (!headerValue) {
      throw new UnauthorizedException('Authorization header is required.');
    }

    const [scheme, token] = headerValue.split(' ');

    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException(
        'Authorization header must use Bearer token.',
      );
    }

    return token;
  }

  resolveActiveFoodtruckContext(
    authUser: AuthenticatedRequestUser,
    requestedFoodtruckId?: string,
    options?: ResolveActiveFoodtruckOptions,
  ): AuthenticatedRequestUser['memberships'][number] | null {
    const normalizedFoodtruckId = requestedFoodtruckId?.trim();
    const memberships = authUser.memberships;

    if (normalizedFoodtruckId) {
      const matchingMembership = memberships.find(
        (membership) => membership.foodtruckId === normalizedFoodtruckId,
      );

      if (!matchingMembership) {
        throw new ForbiddenException(
          'Requested foodtruck is not available for the authenticated user.',
        );
      }

      return matchingMembership;
    }

    if (memberships.length === 1) {
      return memberships[0] ?? null;
    }

    if (options?.requireSelection) {
      if (!memberships.length) {
        throw new ForbiddenException(
          'Authenticated user has no active foodtruck membership.',
        );
      }

      throw new ForbiddenException(
        'x-foodtruck-id header is required when multiple foodtruck memberships exist.',
      );
    }

    return null;
  }

  buildMeContext(
    authUser: AuthenticatedRequestUser,
    requestedFoodtruckId?: string,
  ) {
    const activeFoodtruck = this.resolveActiveFoodtruckContext(
      authUser,
      requestedFoodtruckId,
    );

    return {
      userId: authUser.userId,
      externalAuthId: authUser.externalAuthId,
      role: authUser.role,
      email: authUser.email,
      name: authUser.name,
      canAccessPlatform: authUser.role === UserRole.platform_admin,
      requiresFoodtruckSelection:
        authUser.memberships.length > 1 && !activeFoodtruck,
      memberships: authUser.memberships,
      activeFoodtruck,
    };
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
