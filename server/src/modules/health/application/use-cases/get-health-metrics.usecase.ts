import { Injectable } from '@nestjs/common';
import { UseCase } from '@shared/contracts/use-case';
import { HealthMetrics } from '@modules/health/domain/health-metrics';

@Injectable()
export class GetHealthMetricsUseCase implements UseCase<void, HealthMetrics> {
  execute(): HealthMetrics {
    return {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }
}
