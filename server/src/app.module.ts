import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { envSchema } from './shared/config/env.schema';
import { HealthModule } from './modules/health/health.module';
import { AppLoggerModule } from './shared/logging/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),
    AppLoggerModule,
    HealthModule,
  ],
})
export class AppModule {}
