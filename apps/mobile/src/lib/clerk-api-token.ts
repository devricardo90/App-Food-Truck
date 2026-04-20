type ClerkGetToken = (options?: { template?: string }) => Promise<string | null>;

type ClerkTokenSource = {
  label: 'template' | 'session';
  template: string | null;
  token: string;
};

function readClerkJwtTemplate() {
  return process.env.EXPO_PUBLIC_CLERK_JWT_TEMPLATE?.trim() || undefined;
}

async function buildClerkTokenSources(
  getToken: ClerkGetToken,
): Promise<ClerkTokenSource[]> {
  const template = readClerkJwtTemplate();
  const sources: ClerkTokenSource[] = [];

  if (template) {
    const templateToken = await getToken({ template });

    if (templateToken) {
      sources.push({
        label: 'template',
        template,
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

function getErrorStatus(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof error.status === 'number'
  ) {
    return error.status;
  }

  return null;
}

export async function withClerkApiToken<T>(
  getToken: ClerkGetToken,
  operation: (token: string, source: ClerkTokenSource) => Promise<T>,
): Promise<T> {
  const sources = await buildClerkTokenSources(getToken);

  if (sources.length === 0) {
    const template = readClerkJwtTemplate();
    const templateHint = template
      ? `O template '${template}' nao retornou token para a API e a sessao padrao tambem nao gerou bearer token.`
      : 'A sessao ativa nao retornou bearer token para a API.';

    throw new Error(templateHint);
  }

  let lastError: unknown = null;

  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];

    try {
      return await operation(source.token, source);
    } catch (error) {
      lastError = error;
      const isLastSource = index === sources.length - 1;
      const status = getErrorStatus(error);

      if (status === 401 && !isLastSource) {
        console.log('Mobile Clerk token fallback after 401:', {
          failedSource: source.label,
          failedTemplate: source.template,
          nextSource: sources[index + 1]?.label ?? null,
          nextTemplate: sources[index + 1]?.template ?? null,
        });
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error('Falha ao resolver bearer token do Clerk.');
}

export function getConfiguredClerkJwtTemplate() {
  return readClerkJwtTemplate();
}
