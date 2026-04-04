import 'reflect-metadata';

process.loadEnvFile?.('.env');

import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { buildApiCorsOptions } from './config/runtime';
import {
  type ApiAuthDiagnostic,
  buildRequestLogPayload,
  emitApiLog,
  isObservablePath,
} from './common/observability';

type ObservableMiddlewareRequest = {
  method?: string;
  originalUrl?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  authDiagnostic?: ApiAuthDiagnostic;
};

type ObservableMiddlewareResponse = {
  statusCode?: number;
  on(event: 'finish', callback: () => void): void;
};

async function bootstrap() {
  const bootStartedAt = Date.now();
  const { AppModule } = await import('./modules/app.module');
  const corsOptions = buildApiCorsOptions();
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions || undefined,
  });
  const port = Number(process.env.PORT ?? 3000);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Foodtrucks API')
    .setDescription('Technical OpenAPI reference for the Foodtrucks backend.')
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk session token sent by mobile or admin clients.',
      },
      'clerk',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument, {
    jsonDocumentUrl: 'docs-json',
  });
  app.use(
    '/reference',
    apiReference({
      content: {
        openapi: {
          url: '/docs-json',
        },
      },
    }),
  );

  app.use(
    (
      request: ObservableMiddlewareRequest,
      response: ObservableMiddlewareResponse,
      next: () => void,
    ) => {
      const pathname = request.originalUrl ?? request.url ?? '';

      if (!isObservablePath(pathname)) {
        next();
        return;
      }

      const startedAt = Date.now();

      response.on('finish', () => {
        const statusCode = response.statusCode ?? 0;
        const level =
          statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'log';

        emitApiLog(
          level,
          'api.request.completed',
          buildRequestLogPayload(request, response, Date.now() - startedAt),
        );
      });

      next();
    },
  );

  await app.listen(port);

  emitApiLog('log', 'api.bootstrap.completed', {
    port,
    docsPath: '/docs',
    referencePath: '/reference',
    healthPath: '/health',
    bootstrapDurationMs: Date.now() - bootStartedAt,
    corsEnabled: Boolean(corsOptions),
  });
}

void bootstrap();
