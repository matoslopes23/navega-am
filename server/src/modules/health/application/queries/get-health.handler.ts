import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHealthQuery } from './get-health.query';
import { GetHealthUseCase } from '../use-cases/get-health.usecase';

@QueryHandler(GetHealthQuery)
export class GetHealthHandler implements IQueryHandler<GetHealthQuery> {
  constructor(private readonly useCase: GetHealthUseCase) {}

  execute() {
    return this.useCase.execute();
  }
}
