import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useQuery } from '@tanstack/react-query';

import {
  AuthApiError,
  type AuthMeResponse,
  fetchAuthMe,
} from '../lib/auth-api';

type AuthBootstrapContextValue = {
  authMe: AuthMeResponse | null;
  isBootstrapping: boolean;
  errorMessage: string | null;
};

const AuthBootstrapContext = createContext<AuthBootstrapContextValue>({
  authMe: null,
  isBootstrapping: false,
  errorMessage: null,
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
      const token = await getToken(
        clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
      );

      if (!token) {
        console.log('Mobile /auth/me token missing');
        throw new Error('A sessao ativa nao retornou bearer token.');
      }

      console.log('Mobile /auth/me request:', {
        userId: user?.id ?? null,
        template: clerkJwtTemplate ?? null,
        tokenPreview: token.slice(0, 12),
      });

      return fetchAuthMe(token);
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
      ![401, 403].includes(authMeQuery.error.status)
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
      }}
    >
      {children}
    </AuthBootstrapContext.Provider>
  );
}

export function useAuthBootstrap() {
  return useContext(AuthBootstrapContext);
}
