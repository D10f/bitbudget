import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from '../app.module';

export async function loadNestApplication() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });

  const config = app.get(ConfigService);
  const MODE = config.get<string>('NODE_ENV');
  
  const logger = new Logger(`Main Script - ${MODE}`);

  if (isProduction(MODE)) {
    app.useLogger(app.get(PinoLogger));
    app.use(helmet());
  }

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: isProduction(MODE) ? false : '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  return { app, config, logger };
}

export function isProduction(mode: string): boolean {
  return mode === 'production';
}
