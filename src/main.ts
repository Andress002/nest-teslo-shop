import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptor/logger.interceptor';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.useGlobalInterceptors(new LoggingInterceptor())

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ZodValidationPipe()
  );

  await app.listen(process.env.PORT ?? 3005);
  logger.log(`Application is running on: ${process.env.PORT ?? 3005}`);
}
bootstrap();
