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
      detail?: string | null;
    }
  | {
      status: 'ready';
      data: AdminAuthMeResponse;
      message: string;
      detail?: string | null;
    };

async function readAdminAuthErrorDetail(response: Response) {
  try {
    const contentType = response.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      const payload = (await response.json()) as {
        message?: string | string[];
        error?: string;
      };

      if (Array.isArray(payload.message)) {
        return payload.message.join(' | ');
      }

      if (typeof payload.message === 'string') {
        return payload.message;
      }

      if (typeof payload.error === 'string') {
        return payload.error;
      }
    }

    const text = (await response.text()).trim();

    return text || null;
  } catch {
    return null;
  }
}

export async function resolveAdminAuthContext(): Promise<BackendAuthContext> {
  try {
    const apiBaseUrl =
      process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
    const clerkJwtTemplate =
      process.env.CLERK_JWT_TEMPLATE ??
      process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE;
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

    const token = await authState.getToken(
      clerkJwtTemplate ? { template: clerkJwtTemplate } : undefined,
    );

    if (!token) {
      const templateHint = clerkJwtTemplate
        ? `O template '${clerkJwtTemplate}' nao retornou token para a API.`
        : 'Configure `CLERK_JWT_TEMPLATE` ou `NEXT_PUBLIC_CLERK_JWT_TEMPLATE` se este ambiente depender de JWT template do Clerk.';

      return {
        status: 'missing-token',
        data: null,
        message: `A sessao existe, mas nao gerou bearer token para a API. ${templateHint}`,
      };
    }

    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const detail = await readAdminAuthErrorDetail(response);

      return {
        status: 'api-error',
        data: null,
        message: [
          `A API respondeu ${response.status} ao consultar /auth/me.`,
          detail,
          response.status === 401
            ? 'Verifique o template JWT do Clerk e a sessao do painel.'
            : null,
          response.status === 403
            ? 'Verifique membership, contexto de foodtruck e permissoes do usuario.'
            : null,
        ]
          .filter(Boolean)
          .join(' '),
        detail,
      };
    }

    const data = (await response.json()) as AdminAuthMeResponse;

    return {
      status: 'ready',
      data,
      message: 'Contrato /auth/me validado com token do Clerk.',
      detail: null,
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
      detail: message,
    };
  }
}
