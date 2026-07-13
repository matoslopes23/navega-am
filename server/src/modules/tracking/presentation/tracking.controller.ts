import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SyncGpsBatchUseCase } from '../application/use-cases/sync-gps-batch.use-case';
import { SyncGpsDto } from '../application/dto/sync-gps.dto';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { TrackingParticipationService } from '../application/services/tracking-participation.service';
import { TrackingMaintenanceService } from '../application/services/tracking-maintenance.service';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { RolesGuard } from '@modules/auth/presentation/guards/roles.guard';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly syncGpsBatchUseCase: SyncGpsBatchUseCase,
    private readonly participation: TrackingParticipationService,
    private readonly maintenance: TrackingMaintenanceService,
  ) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sincroniza lote GPS online ou offline',
    description:
      'Requer sessão ativa. Pontos duplicados são ignorados; baixa precisão e velocidade impossível são registrados como rejeitados.',
  })
  @ApiAcceptedResponse({
    description: 'Lote validado e colocado na fila de processamento.',
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @UseGuards(RateLimitGuard, JwtAuthGuard)
  @ApiBearerAuth()
  async syncLocations(
    @Body() dto: SyncGpsDto,
    @Req() request: Request & { user: AuthUser },
  ) {
    await this.participation.heartbeat(dto.tripId, request.user.sub);
    await this.syncGpsBatchUseCase.execute({
      ...dto,
      deviceId: request.user.sub,
    });
    return { message: 'Batch received and queued for processing' };
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Métricas operacionais do tracking (ADMIN)' })
  @ApiOkResponse({
    description: 'Viagens LIVE, colaboradores, relatos e rejeições.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  metrics() {
    return this.maintenance.metrics();
  }
}
