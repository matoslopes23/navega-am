import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { HealthEchoDto } from '@modules/health/presentation/dto/health-echo.dto';
import { GetHealthQuery } from '@modules/health/application/queries/get-health.query';
import { EchoHealthCommand } from '@modules/health/application/commands/echo-health.command';
import { GetHealthMetricsQuery } from '@modules/health/application/queries/get-health-metrics.query';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  getStatus() {
    return this.queryBus.execute(new GetHealthQuery());
  }

  @Get('echo')
  echo(@Query() query: HealthEchoDto) {
    return this.commandBus.execute(new EchoHealthCommand(query.message));
  }

  @Get('metrics')
  metrics() {
    return this.queryBus.execute(new GetHealthMetricsQuery());
  }
}
