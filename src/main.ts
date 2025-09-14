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
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"), false);
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: false,
    });

    app.useGlobalPipes(new ValidationPipe());
    await app.listen(8081);
}
bootstrap();
