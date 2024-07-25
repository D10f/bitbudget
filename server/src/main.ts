import { ValidationPipe } from '@nestjs/common';
import { loadNestApplication } from './config/config.loader';
import { bodyParserMiddleware } from './middleware/bodyParserMiddleware';

async function bootstrap() {
  const { app, config, logger } = await loadNestApplication();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(bodyParserMiddleware);

  const PORT = config.get<string>('PORT');
  const DOMAIN = config.get<string>('DOMAIN');

  await app.listen(PORT);
  logger.log(`App running on ${DOMAIN}:${PORT}`);
}

bootstrap();
