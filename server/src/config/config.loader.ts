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
    mode: config.get('MODE'),
    port: config.get('PORT'),
    domain: config.get('DOMAIN'),
  };
}

export function loadProdConfig(app: INestApplication, config: IAppConfig) {
  app.enableCors(loadCorsConfiguration(config)); // <- this should be first
  app.useLogger(app.get(PinoLogger));
  app.use(helmet());
}

export function loadCorsConfiguration(config: IAppConfig): CorsOptions {
  return {
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    origin: isProduction(config) ? false : '*',
  };
}

export function isProduction(config: IAppConfig): boolean {
  return config.mode === 'production';
}

export async function loadNestApplication() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: false,
  });
  const config = loadAppConfiguration(app);
  const logger = new Logger(`Main Script - ${config.mode}`);
  return { app, config, logger };
}
