import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { emitApiLog } from '../common/observability';
import { parseEnvList, parseOriginList } from '../modules/auth/auth.utils';

const LOCAL_WEB_ORIGINS = ['http://localhost:3001', 'http://127.0.0.1:3001'];

function dedupeOrigins(origins: string[]) {
  return Array.from(new Set(origins));
}

function buildAllowedOrigins() {
  const configuredOrigins = [
    ...(parseOriginList(process.env.CORS_ALLOWED_ORIGINS) ?? []),
    ...(parseOriginList(process.env.CLERK_AUTHORIZED_PARTIES) ?? []),
  ];

  if (configuredOrigins.length) {
    return dedupeOrigins(configuredOrigins);
  }

  const appEnv = (process.env.APP_ENV ?? 'local').trim().toLowerCase();

  if (appEnv === 'local') {
    return LOCAL_WEB_ORIGINS;
  }

  return [];
}

export function buildApiCorsOptions(): CorsOptions | false {
  const allowedOrigins = buildAllowedOrigins();

  if (!allowedOrigins.length) {
    return false;
  }

  return {
    origin(requestOrigin, callback) {
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = parseOriginList(requestOrigin)?.[0] ?? null;

      if (normalizedOrigin && allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      emitApiLog('warn', 'api.cors.origin_rejected', {
        requestOrigin,
        normalizedOrigin,
        allowedOrigins,
      });
      callback(new Error(`Origin '${requestOrigin}' is not allowed by CORS.`));
    },
    credentials: false,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'x-foodtruck-id'],
    optionsSuccessStatus: 204,
  };
}

export function buildAuthEnvironmentSummary() {
  return {
    appEnv: (process.env.APP_ENV ?? 'local').trim().toLowerCase(),
    audience: parseEnvList(process.env.CLERK_AUDIENCE) ?? [],
    authorizedParties:
      parseOriginList(process.env.CLERK_AUTHORIZED_PARTIES) ?? [],
    corsAllowedOrigins: buildAllowedOrigins(),
  };
}
