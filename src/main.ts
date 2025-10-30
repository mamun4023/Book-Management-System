import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // removes unexpected fields
      forbidNonWhitelisted: true, // throws error for unknown fields
      transform: true,            // auto-transform payloads to DTO types
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
