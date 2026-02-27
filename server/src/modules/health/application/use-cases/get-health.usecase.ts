import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../shared/contracts/use-case';
import { HealthStatus } from '../../domain/health-status';
import type { HealthRepository } from '../ports/health.repository';
import { HEALTH_REPOSITORY } from '../../health.tokens';

@Injectable()
export class GetHealthUseCase implements UseCase<void, HealthStatus> {
  constructor(
    @Inject(HEALTH_REPOSITORY)
    private readonly repository: HealthRepository,
  ) {}

  execute(): Promise<HealthStatus> {
    return this.repository.getStatus();
  }
}
