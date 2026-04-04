type ApiLogLevel = 'log' | 'warn' | 'error';

export type ApiAuthDiagnosticCode =
  | 'ok'
  | 'missing-auth'
  | 'invalid-token'
  | 'user-not-found'
  | 'membership-missing'
  | 'role-insufficient'
  | 'foodtruck-selection-required'
  | 'foodtruck-not-allowed'
  | 'internal-error';

export type ApiAuthDiagnostic = {
  code: ApiAuthDiagnosticCode;
  stage: string;
  detail?: string | null;
};

type ObservableRequest = {
  method?: string;
  originalUrl?: string;
  url?: string;
  headers?: Record<string, string | string[] | undefined>;
  authDiagnostic?: ApiAuthDiagnostic;
};

type ObservableResponse = {
  statusCode?: number;
};

function buildBasePayload() {
  return {
    timestamp: new Date().toISOString(),
    service: 'api',
    appEnv: (process.env.APP_ENV ?? 'local').trim().toLowerCase(),
  };
}

function normalizeOrigin(origin: string | string[] | undefined) {
  if (Array.isArray(origin)) {
    return origin[0] ?? null;
  }

  return origin?.trim() || null;
}

function normalizeHeaderPresence(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value?.trim());
}

export function emitApiLog(
  level: ApiLogLevel,
  event: string,
  payload: Record<string, unknown>,
) {
  const body = JSON.stringify({
    ...buildBasePayload(),
    level,
    event,
    ...payload,
  });

  if (level === 'warn') {
    console.warn(body);
    return;
  }

  if (level === 'error') {
    console.error(body);
    return;
  }

  console.log(body);
}

export function setAuthDiagnostic(
  request: { authDiagnostic?: ApiAuthDiagnostic },
  diagnostic: ApiAuthDiagnostic,
) {
  request.authDiagnostic = diagnostic;
}

export function classifyHttpStatus(statusCode: number) {
  if (statusCode >= 500) {
    return 'server-error';
  }

  if (statusCode >= 400) {
    return 'client-error';
  }

  return 'success';
}

export function isObservablePath(pathname: string) {
  return (
    pathname === '/auth/me' ||
    pathname === '/health' ||
    pathname.startsWith('/docs') ||
    pathname.startsWith('/reference')
  );
}

export function buildRequestLogPayload(
  request: ObservableRequest,
  response: ObservableResponse,
  durationMs: number,
) {
  const headers = request.headers ?? {};

  return {
    method: request.method ?? 'UNKNOWN',
    path: request.originalUrl ?? request.url ?? null,
    statusCode: response.statusCode ?? null,
    statusFamily: classifyHttpStatus(response.statusCode ?? 0),
    durationMs,
    origin: normalizeOrigin(headers.origin),
    hasAuthorizationHeader: normalizeHeaderPresence(headers.authorization),
    hasFoodtruckHeader: normalizeHeaderPresence(headers['x-foodtruck-id']),
    authDiagnosticCode: request.authDiagnostic?.code ?? null,
    authDiagnosticStage: request.authDiagnostic?.stage ?? null,
    authDiagnosticDetail: request.authDiagnostic?.detail ?? null,
  };
}
