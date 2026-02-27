import { Injectable } from '@nestjs/common';
import { HealthStatus } from '@modules/health/domain/health-status';
import { HealthRepository } from '@modules/health/application/ports/health.repository';
import { HealthStatusMapper } from '@modules/health/application/mappers/health-status.mapper';

@Injectable()
export class InMemoryHealthRepository implements HealthRepository {
  private readonly mapper = new HealthStatusMapper();

  getStatus(): Promise<HealthStatus> {
    const dto = {
      status: 'ok',
      service: 'navega-api',
      timestamp: new Date().toISOString(),
    };

    return Promise.resolve(this.mapper.toEntity(dto));
  }
}
