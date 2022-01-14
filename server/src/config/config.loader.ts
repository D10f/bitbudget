import { INestApplication, Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from '../app.module';

export interface IAppConfig {
  mode: string;
  port: number;
  domain: string;
}

export function loadAppConfiguration(app): IAppConfig {
  const config = app.get(ConfigService);
  return {
    port: config.get('PORT'),
    mode: config.get('NODE_ENV'),
    domain: config.get('DOMAIN'),
  };
}

export function isProduction(config: IAppConfig): boolean {
  return config.mode === 'production';
}

export function loadProductionConfig(app: INestApplication) {
  app.useLogger(app.get(PinoLogger));
  app.use(helmet());
}

export function loadCorsConfiguration(config: IAppConfig): CorsOptions {
  return {
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    origin: isProduction(config) ? false : '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}

export async function loadNestApplication() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  const config = loadAppConfiguration(app);
  const logger = new Logger(`Main Script - ${config.mode}`);

  if (isProduction(config)) {
    loadProductionConfig(app);
  }

  return { app, config, logger };
}
