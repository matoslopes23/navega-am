import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import { HealthModule } from '@modules/health/health.module';
import { envSchema } from '@shared/config/env.schema';
import { AppLoggerModule } from '@shared/logging/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { HomeModule } from '@modules/home/home.module';
import { TripsModule } from '@modules/trips/trips.module';
import { UrlPingService } from '@shared/jobs/url-ping.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: 100,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        },
      }),
    }),
    AppLoggerModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    HomeModule,
    TripsModule,
    HealthModule,
  ],
  providers: [UrlPingService],
})
export class AppModule { }
