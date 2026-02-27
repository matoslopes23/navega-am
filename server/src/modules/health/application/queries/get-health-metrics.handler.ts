import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHealthMetricsQuery } from './get-health-metrics.query';
import { GetHealthMetricsUseCase } from '../use-cases/get-health-metrics.usecase';

@QueryHandler(GetHealthMetricsQuery)
export class GetHealthMetricsHandler implements IQueryHandler<GetHealthMetricsQuery> {
  constructor(private readonly useCase: GetHealthMetricsUseCase) {}

  execute() {
    return Promise.resolve(this.useCase.execute());
  }
}
