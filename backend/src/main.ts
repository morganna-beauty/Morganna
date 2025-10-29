import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  // Configurar servicio de archivos estáticos
  const uploadsPath = join(process.cwd(), 'public', 'uploads');

  logger.log(`📁 Configurando archivos estáticos desde: ${uploadsPath}`);
  logger.log(`📁 CWD actual: ${process.cwd()}`);

  // Usar middleware personalizado para archivos estáticos
  app.use('/uploads', express.static(uploadsPath));

  const config = new DocumentBuilder()
    .setTitle('Morganna API')
    .setDescription('API documentation for Morganna project')
    .setVersion('1.0')
    .addTag('products', 'Product management')
    .addTag('uploads', 'File upload management')
    .addTag('health', 'Health check endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3001;

  await app.listen(port);

  logger.log(`🚀 Backend running on http://localhost:${port}/api`);
  logger.log(`📚 Swagger UI available at http://localhost:${port}/api-docs`);
}

bootstrap();
