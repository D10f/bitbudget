import { ValidationPipe } from '@nestjs/common';
import {
  loadNestApplication,
  isProduction,
  loadProdConfig,
  loadCorsConfiguration,
} from './config/config.loader';
import { bodyParserMiddleware } from './middleware/bodyParserMiddleware';

async function bootstrap() {
  const { app, config, logger } = await loadNestApplication();

  if (isProduction(config)) {
    loadProdConfig(app);
  }

  app.enableCors(loadCorsConfiguration(config));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(bodyParserMiddleware);

  await app.listen(config.port);
  logger.log(`App running on ${config.domain}:${config.port}`);
}

bootstrap();
