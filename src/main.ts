import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    /^https:\/\/(www\.)?arslanbugra\.com$/,
    "https://music-suggestion.vercel.app"
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const ok = allowedOrigins.some((o) =>
        o instanceof RegExp ? o.test(origin) : o === origin
      );
      return ok
        ? callback(null, true)
        : callback(new Error("Not allowed by CORS"), false);
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    credentials: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8081);
}
bootstrap();
