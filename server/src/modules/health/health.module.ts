import { Module } from '@nestjs/common';
import { HealthController } from './presentation/health.controller';
import { GetHealthUseCase } from './application/use-cases/get-health.usecase';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { HEALTH_REPOSITORY } from './health.tokens';

@Module({
  controllers: [HealthController],
  providers: [
    GetHealthUseCase,
    {
      provide: HEALTH_REPOSITORY,
      useClass: InMemoryHealthRepository,
    },
  ],
})
export class HealthModule {}
