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

export type ClerkAdminGetToken = (options?: {
  template?: string;
}) => Promise<string | null>;

export type AdminAuthState = {
  userId: string | null;
  getToken: ClerkAdminGetToken;
};

type ClerkAdminTokenSource = {
  label: 'template' | 'session';
  template: string | null;
  token: string;
};

export type BackendAuthContext =
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

type ResolveAdminAuthContextDependencies = {
  apiBaseUrl: string | undefined;
  clerkJwtTemplate: string | undefined;
  authState: AdminAuthState;
  fetchImpl: typeof fetch;
  logWarn?: (message: string, payload: object) => void;
};

function classifyAdminAuthFailure(
  statusCode: number,
  data: AdminAuthMeResponse | null,
) {
  if (statusCode === 401) {
    return 'invalid-token';
  }

  if (statusCode === 403) {
    return 'role-or-membership-denied';
  }

  if (statusCode >= 500) {
    return 'internal-error';
  }

  if (data && data.memberships.length === 0) {
    return 'membership-missing';
  }

  return 'api-error';
}

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

async function buildAdminTokenSources(
  getToken: ClerkAdminGetToken,
  clerkJwtTemplate: string | undefined,
) {
  const sources: ClerkAdminTokenSource[] = [];

  if (clerkJwtTemplate) {
    const templateToken = await getToken({ template: clerkJwtTemplate });

    if (templateToken) {
      sources.push({
        label: 'template',
        template: clerkJwtTemplate,
        token: templateToken,
      });
    }
  }

  const sessionToken = await getToken();

  if (
    sessionToken &&
    !sources.some((source) => source.token === sessionToken)
  ) {
    sources.push({
      label: 'session',
      template: null,
      token: sessionToken,
    });
  }

  return sources;
}

export async function resolveAdminAuthContextFromState({
  apiBaseUrl,
  clerkJwtTemplate,
  authState,
  fetchImpl,
  logWarn = console.warn,
}: ResolveAdminAuthContextDependencies): Promise<BackendAuthContext> {
  try {
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

    const tokenSources = await buildAdminTokenSources(
      authState.getToken,
      clerkJwtTemplate,
    );

    if (!tokenSources.length) {
      const templateHint = clerkJwtTemplate
        ? `O template '${clerkJwtTemplate}' nao retornou token para a API.`
        : 'Configure `CLERK_JWT_TEMPLATE` ou `NEXT_PUBLIC_CLERK_JWT_TEMPLATE` se este ambiente depender de JWT template do Clerk, ou garanta que a sessao padrao exponha bearer token.';

      return {
        status: 'missing-token',
        data: null,
        message: `A sessao existe, mas nao gerou bearer token para a API. ${templateHint}`,
      };
    }

    let lastApiError: BackendAuthContext | null = null;

    for (let index = 0; index < tokenSources.length; index += 1) {
      const source = tokenSources[index]!;
      const nextSource = tokenSources[index + 1] ?? null;
      const response = await fetchImpl(`${apiBaseUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${source.token}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = (await response.json()) as AdminAuthMeResponse;

        return {
          status: 'ready',
          data,
          message: 'Contrato /auth/me validado com token do Clerk.',
          detail: null,
        };
      }

      const detail = await readAdminAuthErrorDetail(response);
      const isLastSource = index === tokenSources.length - 1;

      lastApiError = {
        status: 'api-error',
        data: null,
        message: [
          `A API respondeu ${response.status} ao consultar /auth/me.`,
          detail,
          response.status === 401 && !isLastSource
            ? `O token ${source.label === 'template' ? `do template '${source.template}'` : 'da sessao padrao'} falhou; tentando fallback do Clerk.`
            : null,
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

      logWarn('Admin auth context resolution failed', {
        statusCode: response.status,
        category: classifyAdminAuthFailure(response.status, null),
        detail,
        source: source.label,
        template: source.template,
      });

      if (response.status === 401 && !isLastSource) {
        logWarn('Admin Clerk token fallback after 401', {
          failedSource: source.label,
          failedTemplate: source.template,
          nextSource: nextSource?.label ?? null,
          nextTemplate: nextSource?.template ?? null,
        });
        continue;
      }

      return lastApiError;
    }

    return (
      lastApiError ?? {
        status: 'request-failed',
        data: null,
        message: 'Nao foi possivel resolver o contexto autenticado.',
        detail: null,
      }
    );
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
