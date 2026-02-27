import { HealthStatus } from '../../domain/health-status';

export interface HealthRepository {
  getStatus(): Promise<HealthStatus>;
}
