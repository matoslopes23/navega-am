import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/presentation/guards/roles.guard';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import {
  CreateManualPositionDto,
  CreateTripReportDto,
  ModerateTripReportDto,
} from '../application/dto/create-trip-report.dto';
import { TripReportService } from '../application/services/trip-report.service';

@ApiTags('Trip reports')
@ApiBearerAuth()
@UseGuards(RateLimitGuard, JwtAuthGuard)
@Controller('trips/:tripId/reports')
export class TripReportController {
  constructor(private readonly service: TripReportService) {}

  @Post()
  @ApiOperation({
    summary: 'Registra atraso, parada, avaria ou situação de segurança',
  })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Relato pendente criado.' })
  create(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() body: CreateTripReportDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.create(tripId, req.user.sub, body);
  }

  @Post('manual-position')
  @ApiOperation({
    summary: 'Informa posição manual para moderação',
    description:
      'A posição só afeta o tracking depois de confirmada por ADMIN.',
  })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  manualPosition(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() body: CreateManualPositionDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.create(tripId, req.user.sub, {
      ...body,
      type: 'MANUAL_POSITION',
    });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Resume relatos das últimas seis horas' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  summary(@Param('tripId', ParseUUIDPipe) tripId: string) {
    return this.service.summary(tripId);
  }

  @Patch(':reportId/moderate')
  @ApiOperation({ summary: 'Confirma ou rejeita relato (ADMIN)' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  @ApiParam({ name: 'reportId', format: 'uuid' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  moderate(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Param('reportId', ParseUUIDPipe) reportId: string,
    @Body() body: ModerateTripReportDto,
  ) {
    return this.service.moderate(tripId, reportId, body.status);
  }
}
