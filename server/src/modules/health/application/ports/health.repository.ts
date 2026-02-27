import { HealthStatus } from '@modules/health/domain/health-status';

export interface HealthRepository {
  getStatus(): Promise<HealthStatus>;
}
