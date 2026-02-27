import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from '@modules/health/health.module';
import { envSchema } from '@shared/config/env.schema';
import { AppLoggerModule } from '@shared/logging/logger.module';
import { PrismaModule } from '@shared/prisma/prisma.module';

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
    PrismaModule,
    HealthModule,
  ],
})
export class AppModule {}
