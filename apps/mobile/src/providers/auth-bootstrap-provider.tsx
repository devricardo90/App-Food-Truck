import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
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
  const { getToken, isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const authMeQuery = useQuery({
    queryKey: ['auth-me', user?.id],
    queryFn: async () => {
      const token = await getToken();

      if (!token) {
        throw new Error('A sessao ativa nao retornou bearer token.');
      }

      return fetchAuthMe(token);
    },
    enabled: Boolean(isSignedIn && user),
    retry: false,
  });

  useEffect(() => {
    if (!authMeQuery.isError) {
      setErrorMessage(null);
      return;
    }

    const message =
      authMeQuery.error instanceof Error
        ? authMeQuery.error.message
        : 'Falha ao resolver o contexto autenticado.';

    setErrorMessage(message);

    if (
      authMeQuery.error instanceof AuthApiError &&
      [401, 403].includes(authMeQuery.error.status)
    ) {
      void signOut();
    }
  }, [authMeQuery.error, authMeQuery.isError, signOut]);

  return (
    <AuthBootstrapContext.Provider
      value={{
        authMe: authMeQuery.data ?? null,
        isBootstrapping: authMeQuery.isPending,
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
