import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHealthQuery } from '@modules/health/application/queries/get-health.query';
import { GetHealthUseCase } from '@modules/health/application/use-cases/get-health.usecase';

@QueryHandler(GetHealthQuery)
export class GetHealthHandler implements IQueryHandler<GetHealthQuery> {
  constructor(private readonly useCase: GetHealthUseCase) {}

  execute() {
    return this.useCase.execute();
  }
}
