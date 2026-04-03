import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

import {
  AuthApiError,
  type AuthMeResponse,
  fetchAuthMe,
} from '../lib/auth-api';

const AUTH_ME_MAX_ATTEMPTS = 2;
const AUTH_ME_RETRY_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type AuthBootstrapContextValue = {
  authMe: AuthMeResponse | null;
  isBootstrapping: boolean;
  errorMessage: string | null;
  phase:
    | 'signed-out'
    | 'loading-clerk'
    | 'loading-user'
    | 'fetching-auth-me'
    | 'ready'
    | 'error';
};

const AuthBootstrapContext = createContext<AuthBootstrapContextValue>({
  authMe: null,
  isBootstrapping: false,
  errorMessage: null,
  phase: 'signed-out',
});

export function AuthBootstrapProvider({ children }: PropsWithChildren) {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn, signOut } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const hasHandledAuthErrorRef = useRef(false);
  const clerkJwtTemplate =
    process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;

  useEffect(() => {
    console.log('Mobile auth state:', {
      isAuthLoaded,
      isUserLoaded,
      isSignedIn,
      userId: user?.id ?? null,
    });
  }, [isAuthLoaded, isSignedIn, isUserLoaded, user?.id]);

  const authMeQuery = useQuery({
    queryKey: ['auth-me', user?.id],
    queryFn: async () => {
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= AUTH_ME_MAX_ATTEMPTS; attempt += 1) {
        const token = await getToken(
          clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
        );
        const hasToken = Boolean(token);

        console.log('Mobile /auth/me token state:', {
          attempt,
          isAuthLoaded,
          isSignedIn,
          userId: user?.id ?? null,
          template: clerkJwtTemplate ?? null,
          hasToken,
        });

        if (!token) {
          const templateHint = clerkJwtTemplate
            ? `O template '${clerkJwtTemplate}' nao retornou token para a API.`
            : 'Configure EXPO_PUBLIC_CLERK_JWT_TEMPLATE se o ambiente depender de JWT template do Clerk.';

          if (attempt < AUTH_ME_MAX_ATTEMPTS) {
            console.log('Mobile /auth/me retry due to missing token', {
              attempt,
              nextAttempt: attempt + 1,
              delayMs: AUTH_ME_RETRY_DELAY_MS,
            });
            await delay(AUTH_ME_RETRY_DELAY_MS);
            continue;
          }

          throw new Error(
            `A sessao ativa nao retornou bearer token. ${templateHint}`,
          );
        }

        console.log('Mobile /auth/me request:', {
          attempt,
          userId: user?.id ?? null,
          template: clerkJwtTemplate ?? null,
          tokenPreview: token.slice(0, 12),
        });

        try {
          return await fetchAuthMe(token);
        } catch (error) {
          const status = error instanceof AuthApiError ? error.status : null;

          console.log('Mobile /auth/me attempt failed:', {
            attempt,
            status,
            message: error instanceof Error ? error.message : String(error),
          });

          if (status === 401 && attempt < AUTH_ME_MAX_ATTEMPTS) {
            console.log('Mobile /auth/me retry after transient 401', {
              attempt,
              nextAttempt: attempt + 1,
              delayMs: AUTH_ME_RETRY_DELAY_MS,
            });
            await delay(AUTH_ME_RETRY_DELAY_MS);
            continue;
          }

          lastError = error instanceof Error ? error : new Error(String(error));
          break;
        }
      }

      throw lastError ?? new Error('Falha ao resolver o contexto autenticado.');
    },
    enabled: Boolean(isAuthLoaded && isUserLoaded && isSignedIn && user),
    retry: false,
  });

  const isBootstrapping = isSignedIn
    ? !isAuthLoaded || !isUserLoaded || authMeQuery.isPending
    : false;

  const errorMessage = useMemo(() => {
    if (!authMeQuery.isError) {
      return null;
    }

    return authMeQuery.error instanceof Error
      ? authMeQuery.error.message
      : 'Falha ao resolver o contexto autenticado.';
  }, [authMeQuery.error, authMeQuery.isError]);

  const phase: AuthBootstrapContextValue['phase'] = !isSignedIn
    ? 'signed-out'
    : !isAuthLoaded
      ? 'loading-clerk'
      : !isUserLoaded
        ? 'loading-user'
        : authMeQuery.isPending
          ? 'fetching-auth-me'
          : authMeQuery.isError
            ? 'error'
            : 'ready';

  useEffect(() => {
    if (authMeQuery.isSuccess) {
      console.log('Mobile /auth/me success:', {
        userId: authMeQuery.data.userId,
        role: authMeQuery.data.role,
        memberships: authMeQuery.data.memberships.length,
      });
    }
  }, [authMeQuery.data, authMeQuery.isSuccess]);

  useEffect(() => {
    if (authMeQuery.isError) {
      console.log('Mobile /auth/me error:', {
        message:
          authMeQuery.error instanceof Error
            ? authMeQuery.error.message
            : String(authMeQuery.error),
        status:
          authMeQuery.error instanceof AuthApiError
            ? authMeQuery.error.status
            : null,
      });
    }
  }, [authMeQuery.error, authMeQuery.isError]);

  useEffect(() => {
    if (
      !authMeQuery.isError ||
      !(authMeQuery.error instanceof AuthApiError) ||
      authMeQuery.error.status !== 401
    ) {
      hasHandledAuthErrorRef.current = false;
      return;
    }

    if (hasHandledAuthErrorRef.current) {
      return;
    }

    hasHandledAuthErrorRef.current = true;
    console.log('Mobile auth bootstrap signOut due to /auth/me error:', {
      status: authMeQuery.error.status,
    });
    void signOut();
  }, [authMeQuery.error, authMeQuery.isError, signOut]);

  return (
    <AuthBootstrapContext.Provider
      value={{
        authMe: authMeQuery.data ?? null,
        isBootstrapping,
        errorMessage,
        phase,
      }}
    >
      {children}
    </AuthBootstrapContext.Provider>
  );
}

export function useAuthBootstrap() {
  return useContext(AuthBootstrapContext);
}
