import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getAppEnv } from './common/config/app-env';

export async function configureApp(app: INestApplication) {
  const env = getAppEnv();

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('makeVideo API')
      .setDescription('Monorepo scaffold backend API')
      .setVersion('0.1.0')
      .build(),
  );

  SwaggerModule.setup(env.swaggerPath, app, document, {
    jsonDocumentUrl: `${env.swaggerPath}-json`,
  });
}
