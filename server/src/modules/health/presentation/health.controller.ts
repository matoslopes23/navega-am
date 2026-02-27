import { Controller, Get } from '@nestjs/common';
import { GetHealthUseCase } from '../application/use-cases/get-health.usecase';

@Controller('health')
export class HealthController {
  constructor(private readonly getHealth: GetHealthUseCase) {}

  @Get()
  getStatus() {
    return this.getHealth.execute();
  }
}
