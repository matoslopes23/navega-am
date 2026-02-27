import { Controller, Get, Query } from '@nestjs/common';
import { GetHealthUseCase } from '../application/use-cases/get-health.usecase';
import { HealthEchoDto } from './dto/health-echo.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly getHealth: GetHealthUseCase) {}

  @Get()
  getStatus() {
    return this.getHealth.execute();
  }

  @Get('echo')
  echo(@Query() query: HealthEchoDto) {
    return {
      message: query.message,
    };
  }
}
