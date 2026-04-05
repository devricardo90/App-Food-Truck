import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../../generated/prisma/enums';

import type {
  AuthenticatedRequestUser,
  ResolveActiveFoodtruckOptions,
} from './auth.types';

export function parseEnvList(value: string | undefined) {
  const parsed = value
    ?.split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  return parsed?.length ? parsed : undefined;
}

export function parseOriginList(value: string | undefined) {
  const parsed = parseEnvList(value)?.map((entry) =>
    entry.replace(/\/+$/, '').trim(),
  );

  return parsed?.length ? Array.from(new Set(parsed)) : undefined;
}

export function extractBearerToken(headerValue: string | undefined) {
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

export function resolveActiveFoodtruckContext(
  authUser: AuthenticatedRequestUser,
  requestedFoodtruckId?: string,
  options?: ResolveActiveFoodtruckOptions,
) {
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

export function buildMeContext(
  authUser: AuthenticatedRequestUser,
  requestedFoodtruckId?: string,
) {
  const activeFoodtruck = resolveActiveFoodtruckContext(
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
