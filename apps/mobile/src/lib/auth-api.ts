export type AuthMembership = {
  id: string;
  foodtruckId: string;
  foodtruckSlug: string;
  foodtruckName: string;
  role: string;
  status: string;
};

export type AuthMeResponse = {
  userId: string;
  externalAuthId: string;
  role: string;
  email: string | null;
  name: string | null;
  canAccessPlatform: boolean;
  requiresFoodtruckSelection: boolean;
  memberships: AuthMembership[];
  activeFoodtruck: AuthMembership | null;
};

export type AuthApiErrorKind =
  | 'missing-config'
  | 'unauthorized'
  | 'forbidden'
  | 'request-failed'
  | 'unknown';

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly kind: AuthApiErrorKind,
    public readonly detail: string | null = null,
  ) {
    super(message);
    this.name = 'AuthApiError';
  }
}

async function readAuthErrorDetail(response: Response) {
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

type FetchAuthMeDependencies = {
  apiBaseUrl: string | undefined;
  fetchImpl: typeof fetch;
};

export async function fetchAuthMeWithDependencies(
  token: string,
  { apiBaseUrl, fetchImpl }: FetchAuthMeDependencies,
): Promise<AuthMeResponse> {
  if (!apiBaseUrl) {
    throw new AuthApiError(
      'Defina EXPO_PUBLIC_API_BASE_URL para consultar /auth/me no mobile.',
      0,
      'missing-config',
      null,
    );
  }

  let response: Response;

  try {
    response = await fetchImpl(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : 'Falha inesperada de rede ao consultar /auth/me.';

    throw new AuthApiError(
      `Nao foi possivel consultar /auth/me no mobile. ${detail}`,
      0,
      'request-failed',
      detail,
    );
  }

  if (!response.ok) {
    const detail = await readAuthErrorDetail(response);
    const diagnostics = [
      `A API respondeu ${response.status} ao consultar /auth/me no mobile.`,
      detail,
      response.status === 401
        ? 'Verifique a sessao do Clerk e o template de JWT configurado no mobile.'
        : null,
      response.status === 403
        ? 'Verifique membership, foodtruck ativo e escopo retornado pelo backend.'
        : null,
    ]
      .filter(Boolean)
      .join(' ');

    throw new AuthApiError(
      diagnostics,
      response.status,
      response.status === 401
        ? 'unauthorized'
        : response.status === 403
          ? 'forbidden'
          : 'request-failed',
      detail,
    );
  }

  return (await response.json()) as AuthMeResponse;
}

export async function fetchAuthMe(token: string): Promise<AuthMeResponse> {
  return fetchAuthMeWithDependencies(token, {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    fetchImpl: fetch,
  });
}
