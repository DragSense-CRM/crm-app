import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';


import { configOptions, appConfig, databaseConfig, jwtConfig, mailerConfig, getTypeOrmConfig, getMongooseConfig, getMailerConfig, fileUploadConfig } from './config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './modules/v1/users/users.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { WorkspacesModule } from './modules/v1/workspaces/workspaces.module';
import { DepUsersModule } from './modules/v1/departments/dep-users/dep-users.module';
import { DepUsersModule } from './modules/v1/workspace/departments/dep-users/dep-users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...configOptions,
      load: [appConfig, databaseConfig, jwtConfig, mailerConfig, fileUploadConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    MongooseModule.forRootAsync({
      useFactory: getMongooseConfig,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: getMailerConfig,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),

    AuthModule,
    UsersModule,
    WorkspacesModule,
    DepUsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule { }
