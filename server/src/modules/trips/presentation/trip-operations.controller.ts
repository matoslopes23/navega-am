import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/presentation/guards/roles.guard';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ManageTripOperationsUseCase } from '../application/use-cases/manage-trip-operations.usecase';
import { GetTripHistoryUseCase } from '../application/use-cases/get-trip-history.usecase';
import {
  AssignTripRouteDto,
  CreatePortDto,
  CreateRiverRouteDto,
} from './dto/trip-operations.dto';

@Controller('operations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Operations')
@ApiBearerAuth()
export class TripOperationsController {
  constructor(private readonly operations: ManageTripOperationsUseCase) {}

  @Get('ports')
  @ApiOperation({ summary: 'Lista portos e áreas de geofencing (ADMIN)' })
  ports() {
    return this.operations.listPorts();
  }

  @Post('ports')
  @ApiOperation({ summary: 'Cadastra porto (ADMIN)' })
  createPort(@Body() body: CreatePortDto) {
    return this.operations.createPort(body);
  }

  @Get('routes')
  @ApiOperation({ summary: 'Lista rotas fluviais GeoJSON (ADMIN)' })
  routes() {
    return this.operations.listRoutes();
  }

  @Post('routes')
  @ApiOperation({ summary: 'Cadastra rota fluvial (ADMIN)' })
  createRoute(@Body() body: CreateRiverRouteDto) {
    return this.operations.createRoute(body);
  }

  @Patch('trips/:tripId/route')
  @ApiOperation({ summary: 'Associa rota fluvial a uma viagem (ADMIN)' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  assignRoute(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() body: AssignTripRouteDto,
  ) {
    return this.operations.assignRoute(tripId, body.routeId);
  }
}

@Controller('trips')
@ApiTags('Trips')
export class TripHistoryController {
  constructor(private readonly historyUseCase: GetTripHistoryUseCase) {}

  @Get(':id/location-history')
  @ApiOperation({
    summary: 'Histórico público com coordenadas de precisão reduzida',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') pageValue?: string,
  ) {
    const page = Math.max(1, Number(pageValue) || 1);
    return this.historyUseCase.locations(id, page);
  }

  @Get(':id/timeline')
  @ApiOperation({ summary: 'Timeline operacional da viagem' })
  @ApiParam({ name: 'id', format: 'uuid' })
  timeline(@Param('id', ParseUUIDPipe) id: string) {
    return this.historyUseCase.timeline(id);
  }
}
