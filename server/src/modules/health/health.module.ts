import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from './presentation/health.controller';
import { GetHealthUseCase } from './application/use-cases/get-health.usecase';
import { InMemoryHealthRepository } from './infrastructure/repositories/in-memory-health.repository';
import { HEALTH_REPOSITORY } from './health.tokens';
import { GetHealthHandler } from './application/queries/get-health.handler';
import { EchoHealthHandler } from './application/commands/echo-health.handler';
import { GetHealthMetricsHandler } from './application/queries/get-health-metrics.handler';
import { GetHealthMetricsUseCase } from './application/use-cases/get-health-metrics.usecase';

@Module({
  imports: [CqrsModule],
  controllers: [HealthController],
  providers: [
    GetHealthUseCase,
    GetHealthMetricsUseCase,
    GetHealthHandler,
    GetHealthMetricsHandler,
    EchoHealthHandler,
    {
      provide: HEALTH_REPOSITORY,
      useClass: InMemoryHealthRepository,
    },
  ],
})
export class HealthModule {}
