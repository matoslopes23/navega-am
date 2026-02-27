import { Injectable } from '@nestjs/common';
import { HealthStatus } from '../../domain/health-status';
import { HealthRepository } from '../../application/ports/health.repository';

@Injectable()
export class InMemoryHealthRepository implements HealthRepository {
  getStatus(): Promise<HealthStatus> {
    return Promise.resolve({
      status: 'ok',
      service: 'navega-api',
      timestamp: new Date().toISOString(),
    });
  }
}
