import { auth } from '@clerk/nextjs/server';

export type AdminAuthMembership = {
  id: string;
  foodtruckId: string;
  foodtruckSlug: string;
  foodtruckName: string;
  role: string;
  status: string;
};

export type AdminAuthMeResponse = {
  userId: string;
  externalAuthId: string;
  role: string;
  email: string | null;
  name: string | null;
  canAccessPlatform: boolean;
  requiresFoodtruckSelection: boolean;
  memberships: AdminAuthMembership[];
  activeFoodtruck: AdminAuthMembership | null;
};

type BackendAuthContext =
  | {
      status:
        | 'missing-session'
        | 'missing-config'
        | 'missing-token'
        | 'api-error'
        | 'request-failed';
      data: null;
      message: string;
    }
  | {
      status: 'ready';
      data: AdminAuthMeResponse;
      message: string;
    };

export async function resolveAdminAuthContext(): Promise<BackendAuthContext> {
  try {
    const apiBaseUrl =
      process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
    const authState = await auth();

    if (!authState.userId) {
      return {
        status: 'missing-session',
        data: null,
        message: 'Sessao Clerk ausente na rota protegida.',
      };
    }

    if (!apiBaseUrl) {
      return {
        status: 'missing-config',
        data: null,
        message:
          'Defina `API_BASE_URL` ou `NEXT_PUBLIC_API_BASE_URL` para consultar `/auth/me`.',
      };
    }

    const token = await authState.getToken();

    if (!token) {
      return {
        status: 'missing-token',
        data: null,
        message: 'A sessao existe, mas nao gerou bearer token para a API.',
      };
    }

    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return {
        status: 'api-error',
        data: null,
        message: `A API respondeu ${response.status} ao consultar /auth/me.`,
      };
    }

    const data = (await response.json()) as AdminAuthMeResponse;

    return {
      status: 'ready',
      data,
      message: 'Contrato /auth/me validado com token do Clerk.',
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Falha inesperada ao consultar /auth/me.';

    return {
      status: 'request-failed',
      data: null,
      message: `Nao foi possivel resolver o contexto autenticado: ${message}`,
    };
  }
}
