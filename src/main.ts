import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const allowedOrigins = [
      "https://music-suggestion.vercel.app",
      "https://arslanbugra.com",
    ];

    app.enableCors({
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: false,
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8081);
}
bootstrap();
