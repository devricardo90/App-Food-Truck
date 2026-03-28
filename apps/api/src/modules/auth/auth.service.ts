import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';

import { FoodtruckMembershipsService } from '../foodtruck-memberships/foodtruck-memberships.service';
import { UsersService } from '../users/users.service';
import type { AuthenticatedRequestUser } from './auth.types';

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

    const authorizedParties = process.env.CLERK_AUTHORIZED_PARTIES?.split(',')
      .map((party) => party.trim())
      .filter(Boolean);
    const audience = process.env.CLERK_AUDIENCE?.split(',')
      .map((value) => value.trim())
      .filter(Boolean);

    const claims = (await verifyToken(token, {
      secretKey,
      jwtKey: process.env.CLERK_JWT_KEY,
      authorizedParties: authorizedParties?.length
        ? authorizedParties
        : undefined,
      audience: audience?.length ? audience : undefined,
    })) as ClerkClaims;
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
