import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Game API')
    .setDescription('API for managing games, users, reviews, and user game lists')
    .setVersion('1.0')
    .addTag('games', 'Game management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('reviews', 'Review management endpoints')
    .addTag('user-game-lists', 'User game lists (favorites, want-to-play, viewed)')
    .addTag('screenshots', 'Screenshot management endpoints')
    .addTag('trailers', 'Trailer management endpoints')
    .addTag('achievements', 'Achievement management endpoints')
    .addTag('rawg', 'RAWG API integration endpoints')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
