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

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
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

export async function fetchAuthMe(token: string): Promise<AuthMeResponse> {
  const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      'Defina EXPO_PUBLIC_API_BASE_URL para consultar /auth/me no mobile.',
    );
  }

  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

    throw new AuthApiError(diagnostics, response.status, detail);
  }

  return (await response.json()) as AuthMeResponse;
}
