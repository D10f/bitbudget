import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configValidationSchema } from './config/config.schema';
import { WalletsModule } from './wallets/wallets.module';
import { ExpensesModule } from './expenses/expenses.module';

const mongooseConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get('MONGO_URI'),
  }),
};

const appConfig = {
  envFilePath: ['.env'],
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
export class AppModule{}
