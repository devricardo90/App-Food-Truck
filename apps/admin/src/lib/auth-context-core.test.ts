import assert from 'node:assert/strict';

import {
  resolveAdminAuthContextFromState,
  type AdminAuthMeResponse,
  type AdminAuthState,
} from './auth-context-core';

async function runTest(name: string, assertion: () => Promise<void> | void) {
  try {
    await assertion();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

function createAuthState(): AdminAuthState {
  return {
    userId: 'user_123',
    getToken: async () => 'token_123',
  };
}

function createSuccessPayload(): AdminAuthMeResponse {
  return {
    userId: 'user_123',
    externalAuthId: 'ext_123',
    role: 'truck_manager',
    email: 'operator@example.com',
    name: 'Operator',
    canAccessPlatform: false,
    requiresFoodtruckSelection: false,
    memberships: [
      {
        id: 'membership_1',
        foodtruckId: 'truck_1',
        foodtruckSlug: 'funky-chicken',
        foodtruckName: 'Funky Chicken',
        role: 'truck_manager',
        status: 'active',
      },
    ],
    activeFoodtruck: {
      id: 'membership_1',
      foodtruckId: 'truck_1',
      foodtruckSlug: 'funky-chicken',
      foodtruckName: 'Funky Chicken',
      role: 'truck_manager',
      status: 'active',
    },
  };
}

async function main() {
  await runTest(
    'resolveAdminAuthContextFromState returns ready for a valid /auth/me context',
    async () => {
      const payload = createSuccessPayload();
      const calls: string[] = [];

      const result = await resolveAdminAuthContextFromState({
        apiBaseUrl: 'http://localhost:3333',
        clerkJwtTemplate: 'foodtrucks-api',
        authState: createAuthState(),
        fetchImpl: async (input) => {
          calls.push(String(input));
          return new Response(JSON.stringify(payload), {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          });
        },
      });

      assert.equal(result.status, 'ready');
      assert.deepEqual(result.data, payload);
      assert.deepEqual(calls, ['http://localhost:3333/auth/me']);
    },
  );

  await runTest('resolveAdminAuthContextFromState reports 401 from /auth/me', async () => {
    const result = await resolveAdminAuthContextFromState({
      apiBaseUrl: 'http://localhost:3333',
      clerkJwtTemplate: undefined,
      authState: createAuthState(),
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            message: 'Token invalido',
          }),
          {
            status: 401,
            headers: {
              'content-type': 'application/json',
            },
          },
        ),
    });

    assert.equal(result.status, 'api-error');
    assert.match(result.message, /401/);
    assert.match(result.message, /Token invalido/);
    assert.match(result.message, /template JWT do Clerk/i);
  });

  await runTest('resolveAdminAuthContextFromState reports 403 from /auth/me', async () => {
    const result = await resolveAdminAuthContextFromState({
      apiBaseUrl: 'http://localhost:3333',
      clerkJwtTemplate: undefined,
      authState: createAuthState(),
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            message: 'Membership ausente',
          }),
          {
            status: 403,
            headers: {
              'content-type': 'application/json',
            },
          },
        ),
    });

    assert.equal(result.status, 'api-error');
    assert.match(result.message, /403/);
    assert.match(result.message, /Membership ausente/);
    assert.match(
      result.message,
      /membership, contexto de foodtruck e permissoes/i,
    );
  });

  await runTest(
    'resolveAdminAuthContextFromState reports request failure when fetch throws',
    async () => {
      const result = await resolveAdminAuthContextFromState({
        apiBaseUrl: 'http://localhost:3333',
        clerkJwtTemplate: undefined,
        authState: createAuthState(),
        fetchImpl: async () => {
          throw new Error('network down');
        },
      });

      assert.equal(result.status, 'request-failed');
      assert.match(result.message, /network down/);
      assert.equal(result.detail, 'network down');
    },
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
