import 'reflect-metadata';

process.loadEnvFile?.('.env');

import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const { AppModule } = await import('./modules/app.module');
  const app = await NestFactory.create(AppModule);
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

  await app.listen(port);
}

void bootstrap();
