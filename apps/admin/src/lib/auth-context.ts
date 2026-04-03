import { auth } from '@clerk/nextjs/server';
import {
  resolveAdminAuthContextFromState,
  type BackendAuthContext,
} from './auth-context-core';

export type {
  AdminAuthMembership,
  AdminAuthMeResponse,
  BackendAuthContext,
} from './auth-context-core';

export async function resolveAdminAuthContext(): Promise<BackendAuthContext> {
  const apiBaseUrl =
    process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  const clerkJwtTemplate =
    process.env.CLERK_JWT_TEMPLATE ??
    process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;
  const authState = await auth();

  return resolveAdminAuthContextFromState({
    apiBaseUrl,
    clerkJwtTemplate,
    authState,
    fetchImpl: fetch,
  });
}
