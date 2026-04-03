import assert from 'node:assert/strict';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { UserRole } from '../../generated/prisma/enums';
import type { AuthenticatedRequestUser } from './auth.types';
import {
  buildMeContext,
  extractBearerToken,
  parseEnvList,
  resolveActiveFoodtruckContext,
} from './auth.utils';

function buildAuthUser(
  memberships: AuthenticatedRequestUser['memberships'],
): AuthenticatedRequestUser {
  return {
    userId: 'user_123',
    externalAuthId: 'ext_123',
    role: UserRole.truck_manager,
    email: 'operator@example.com',
    name: 'Operator',
    memberships,
    tokenSubject: 'clerk_user_123',
  };
}

function runTest(name: string, assertion: () => void) {
  try {
    assertion();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

runTest('parseEnvList normalizes comma-separated values', () => {
  assert.deepEqual(parseEnvList('  app-a, app-b ,,app-c '), [
    'app-a',
    'app-b',
    'app-c',
  ]);
  assert.equal(parseEnvList(undefined), undefined);
  assert.equal(parseEnvList('   ,  '), undefined);
});

runTest('extractBearerToken returns the token for valid bearer headers', () => {
  assert.equal(extractBearerToken('Bearer token-123'), 'token-123');
  assert.equal(extractBearerToken('bearer token-456'), 'token-456');
});

runTest('extractBearerToken rejects missing or malformed headers', () => {
  assert.throws(
    () => extractBearerToken(undefined),
    (error: unknown) =>
      error instanceof UnauthorizedException &&
      error.message === 'Authorization header is required.',
  );

  assert.throws(
    () => extractBearerToken('Basic token-123'),
    (error: unknown) =>
      error instanceof UnauthorizedException &&
      error.message === 'Authorization header must use Bearer token.',
  );
});

runTest(
  'resolveActiveFoodtruckContext auto-selects a single membership',
  () => {
    const membership = {
      id: 'membership_1',
      foodtruckId: 'truck_1',
      foodtruckSlug: 'funky-chicken',
      foodtruckName: 'Funky Chicken',
      role: 'truck_manager',
      status: 'active',
    } as AuthenticatedRequestUser['memberships'][number];

    assert.deepEqual(
      resolveActiveFoodtruckContext(buildAuthUser([membership])),
      membership,
    );
  },
);

runTest(
  'resolveActiveFoodtruckContext requires explicit selection when needed',
  () => {
    const authUser = buildAuthUser([
      {
        id: 'membership_1',
        foodtruckId: 'truck_1',
        foodtruckSlug: 'funky-chicken',
        foodtruckName: 'Funky Chicken',
        role: 'truck_manager',
        status: 'active',
      } as AuthenticatedRequestUser['memberships'][number],
      {
        id: 'membership_2',
        foodtruckId: 'truck_2',
        foodtruckSlug: 'smoke-house',
        foodtruckName: 'Smoke House',
        role: 'truck_operator',
        status: 'active',
      } as AuthenticatedRequestUser['memberships'][number],
    ]);

    assert.equal(resolveActiveFoodtruckContext(authUser), null);

    assert.throws(
      () =>
        resolveActiveFoodtruckContext(authUser, undefined, {
          requireSelection: true,
        }),
      (error: unknown) =>
        error instanceof ForbiddenException &&
        error.message ===
          'x-foodtruck-id header is required when multiple foodtruck memberships exist.',
    );
  },
);

runTest(
  'resolveActiveFoodtruckContext rejects unauthorized foodtruck selection',
  () => {
    const authUser = buildAuthUser([
      {
        id: 'membership_1',
        foodtruckId: 'truck_1',
        foodtruckSlug: 'funky-chicken',
        foodtruckName: 'Funky Chicken',
        role: 'truck_manager',
        status: 'active',
      } as AuthenticatedRequestUser['memberships'][number],
    ]);

    assert.throws(
      () => resolveActiveFoodtruckContext(authUser, 'truck_2'),
      (error: unknown) =>
        error instanceof ForbiddenException &&
        error.message ===
          'Requested foodtruck is not available for the authenticated user.',
    );
  },
);

runTest(
  'buildMeContext marks platform access and resolves active membership',
  () => {
    const membership = {
      id: 'membership_1',
      foodtruckId: 'truck_1',
      foodtruckSlug: 'funky-chicken',
      foodtruckName: 'Funky Chicken',
      role: 'truck_manager',
      status: 'active',
    } as AuthenticatedRequestUser['memberships'][number];

    const authUser: AuthenticatedRequestUser = {
      ...buildAuthUser([membership]),
      role: UserRole.platform_admin,
    };

    assert.deepEqual(buildMeContext(authUser, 'truck_1'), {
      userId: authUser.userId,
      externalAuthId: authUser.externalAuthId,
      role: UserRole.platform_admin,
      email: authUser.email,
      name: authUser.name,
      canAccessPlatform: true,
      requiresFoodtruckSelection: false,
      memberships: [membership],
      activeFoodtruck: membership,
    });
  },
);

runTest(
  'buildMeContext flags selection requirement when multiple memberships exist',
  () => {
    const authUser = buildAuthUser([
      {
        id: 'membership_1',
        foodtruckId: 'truck_1',
        foodtruckSlug: 'funky-chicken',
        foodtruckName: 'Funky Chicken',
        role: 'truck_manager',
        status: 'active',
      } as AuthenticatedRequestUser['memberships'][number],
      {
        id: 'membership_2',
        foodtruckId: 'truck_2',
        foodtruckSlug: 'smoke-house',
        foodtruckName: 'Smoke House',
        role: 'truck_operator',
        status: 'active',
      } as AuthenticatedRequestUser['memberships'][number],
    ]);

    const context = buildMeContext(authUser);

    assert.equal(context.canAccessPlatform, false);
    assert.equal(context.requiresFoodtruckSelection, true);
    assert.equal(context.activeFoodtruck, null);
  },
);
