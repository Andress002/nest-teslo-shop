import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptor/logger.interceptor';
import { ZodValidationPipe } from 'nestjs-zod';
import { TransformInterceptor } from './common/interceptor/trasform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(reflector),
  );

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT ?? 3005);
  logger.log(`Application is running on: ${process.env.PORT ?? 3005}`);
}
bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
