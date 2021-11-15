import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

function loadAppConfiguration(app) {
  const config = app.get(ConfigService);
  return {
    mode: config.get('MODE'),
    port: config.get('PORT'),
    domain: config.get('DOMAIN'),
  };
}

function loadCorsConfiguration(config) {
  return {
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    origin: config.mode === 'production' ? false : '*',
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const config = loadAppConfiguration(app);

  const logger = new Logger(`Main Script - ${config.mode}`);

  if (config.mode === 'production') {
    app.enableCors(loadCorsConfiguration(config));
    app.useLogger(app.get(PinoLogger));
    app.use(helmet());
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(config.port);
  logger.log(`App running on ${config.domain}:${config.port}`);
}

bootstrap();
