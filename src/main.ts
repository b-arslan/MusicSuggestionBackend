import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    /^https:\/\/(www\.)?arslanbugra\.com$/,
    'https://music-suggestion.vercel.app',
  ];

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const ok = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
      return ok ? cb(null, true) : cb(new Error('Not allowed by CORS'), false);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
    credentials: false,
    optionsSuccessStatus: 204,
  });

  app.use((req, res, next) => {
    const origin = req.headers.origin as string | undefined;
    if (origin) {
      const ok = allowedOrigins.some(o => o instanceof RegExp ? o.test(origin) : o === origin);
      if (ok) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Vary', 'Origin');
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      }
    }
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
    next();
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(8081);
}
bootstrap();
