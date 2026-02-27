import { Injectable } from '@nestjs/common';
import { HealthStatus } from '../../domain/health-status';
import { HealthRepository } from '../../application/ports/health.repository';
import { HealthStatusMapper } from '../../application/mappers/health-status.mapper';

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
