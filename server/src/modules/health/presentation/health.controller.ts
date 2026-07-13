import { Controller, Get, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthEchoDto } from '@modules/health/presentation/dto/health-echo.dto';
import { GetHealthQuery } from '@modules/health/application/queries/get-health.query';
import { EchoHealthCommand } from '@modules/health/application/commands/echo-health.command';
import { GetHealthMetricsQuery } from '@modules/health/application/queries/get-health-metrics.query';
import {
  HealthEchoResponseDto,
  HealthMetricsResponseDto,
  HealthStatusResponseDto,
} from '@modules/health/presentation/dto/health-response.dto';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Consulta a disponibilidade básica da API' })
  @ApiOkResponse({
    description: 'Status básico de saúde da API.',
    type: HealthStatusResponseDto,
  })
  getStatus() {
    return this.queryBus.execute(new GetHealthQuery());
  }

  @Get('echo')
  @ApiOperation({ summary: 'Testa o processamento de parâmetros da API' })
  @ApiOkResponse({
    description: 'Ecoa a mensagem enviada na query string.',
    type: HealthEchoResponseDto,
  })
  echo(@Query() query: HealthEchoDto) {
    return this.commandBus.execute(new EchoHealthCommand(query.message));
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Consulta métricas de runtime da API' })
  @ApiOkResponse({
    description: 'Métricas de runtime do serviço.',
    type: HealthMetricsResponseDto,
  })
  metrics() {
    return this.queryBus.execute(new GetHealthMetricsQuery());
  }
}
