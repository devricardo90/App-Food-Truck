import assert from 'node:assert/strict';

import {
  AuthApiError,
  fetchAuthMeWithDependencies,
  type AuthMeResponse,
} from './auth-api';

async function runTest(name: string, assertion: () => Promise<void> | void) {
  try {
    await assertion();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

function createSuccessPayload(): AuthMeResponse {
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
    'fetchAuthMeWithDependencies returns /auth/me payload for a valid context',
    async () => {
      const payload = createSuccessPayload();

      const data = await fetchAuthMeWithDependencies('token_123', {
        apiBaseUrl: 'http://localhost:3333',
        fetchImpl: async () =>
          new Response(JSON.stringify(payload), {
            status: 200,
            headers: {
              'content-type': 'application/json',
            },
          }),
      });

      assert.deepEqual(data, payload);
    },
  );

  await runTest('fetchAuthMeWithDependencies maps 401 to unauthorized', async () => {
    await assert.rejects(
      () =>
        fetchAuthMeWithDependencies('token_123', {
          apiBaseUrl: 'http://localhost:3333',
          fetchImpl: async () =>
            new Response(
              JSON.stringify({
                message: 'Token expirado',
              }),
              {
                status: 401,
                headers: {
                  'content-type': 'application/json',
                },
              },
            ),
        }),
      (error: unknown) =>
        error instanceof AuthApiError &&
        error.kind === 'unauthorized' &&
        error.status === 401 &&
        /Token expirado/.test(error.message),
    );
  });

  await runTest('fetchAuthMeWithDependencies maps 403 to forbidden', async () => {
    await assert.rejects(
      () =>
        fetchAuthMeWithDependencies('token_123', {
          apiBaseUrl: 'http://localhost:3333',
          fetchImpl: async () =>
            new Response(
              JSON.stringify({
                message: 'Sem membership ativa',
              }),
              {
                status: 403,
                headers: {
                  'content-type': 'application/json',
                },
              },
            ),
        }),
      (error: unknown) =>
        error instanceof AuthApiError &&
        error.kind === 'forbidden' &&
        error.status === 403 &&
        /Sem membership ativa/.test(error.message),
    );
  });

  await runTest(
    'fetchAuthMeWithDependencies maps request failures to request-failed',
    async () => {
      await assert.rejects(
        () =>
          fetchAuthMeWithDependencies('token_123', {
            apiBaseUrl: 'http://localhost:3333',
            fetchImpl: async () => {
              throw new Error('network down');
            },
          }),
        (error: unknown) =>
          error instanceof AuthApiError &&
          error.kind === 'request-failed' &&
          error.status === 0 &&
          error.detail === 'network down',
      );
    },
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
