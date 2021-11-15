import { ValidationPipe } from '@nestjs/common';
import {
  loadNestApplication,
  isProduction,
  loadProdConfig,
} from './config/config.loader';

async function bootstrap() {
  const { app, config, logger } = await loadNestApplication();

  if (isProduction(config)) {
    loadProdConfig(app, config);
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(config.port);
  logger.log(`App running on ${config.domain}:${config.port}`);
}

bootstrap();
