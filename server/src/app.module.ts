import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config/config.schema';
import { WalletsModule } from './wallets/wallets.module';
import { ExpensesModule } from './expenses/expenses.module';
import { readDockerSecrets } from './config/configuration';

const mongooseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const name = configService.get('MONGODB_NAME');
    const user = configService.get('MONGODB_USER');
    const password = configService.get('MONGODB_PASSWORD');
    return {
      uri: `mongodb://${user}:${password}@mongo:27017/${name}?authSource=admin`,
    };
  },
};

const appConfig = {
  ignoreEnvFile: true,
  load: [readDockerSecrets],
  validationSchema: configValidationSchema,
};

@Module({
  imports: [
    MongooseModule.forRootAsync(mongooseConfig),
    ConfigModule.forRoot(appConfig),
    LoggerModule.forRoot(),
    AuthModule,
    UsersModule,
    WalletsModule,
    ExpensesModule,
  ],
})
export class AppModule {}
