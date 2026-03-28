import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 3000);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Foodtrucks API')
    .setDescription('Technical OpenAPI reference for the Foodtrucks backend.')
    .setVersion('0.1.0')
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
