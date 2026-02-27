import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HealthController } from '@modules/health/presentation/health.controller';
import { GetHealthUseCase } from '@modules/health/application/use-cases/get-health.usecase';
import { InMemoryHealthRepository } from '@modules/health/infrastructure/repositories/in-memory-health.repository';
import { HEALTH_REPOSITORY } from '@modules/health/health.tokens';
import { GetHealthHandler } from '@modules/health/application/queries/get-health.handler';
import { EchoHealthHandler } from '@modules/health/application/commands/echo-health.handler';
import { GetHealthMetricsHandler } from '@modules/health/application/queries/get-health-metrics.handler';
import { GetHealthMetricsUseCase } from '@modules/health/application/use-cases/get-health-metrics.usecase';

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
