import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import { TrackingParticipationService } from '../application/services/tracking-participation.service';

@ApiTags('Tracking')
@ApiBearerAuth()
@UseGuards(RateLimitGuard, JwtAuthGuard)
@Controller('trips/:tripId/tracking')
export class TrackingParticipationController {
  constructor(private readonly service: TrackingParticipationService) {}

  @Post('start')
  @ApiOperation({
    summary: 'Inicia o compartilhamento de localização',
    description:
      'Exige viagem em trânsito e consentimento de localização previamente concedido.',
  })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Sessão ativa; iniciar heartbeat e sincronização GPS.',
  })
  start(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.start(tripId, req.user.sub);
  }

  @Post('heartbeat')
  @ApiOperation({
    summary: 'Mantém a sessão de compartilhamento ativa',
    description:
      'Enviar antes de completar dois minutos desde o heartbeat anterior.',
  })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  heartbeat(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.heartbeat(tripId, req.user.sub);
  }

  @Post('stop')
  @ApiOperation({ summary: 'Encerra voluntariamente o compartilhamento' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  stop(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.stop(tripId, req.user.sub);
  }

  @Get('status')
  @ApiOperation({ summary: 'Consulta estado LIVE, confiança e colaboradores' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  status(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.status(tripId, req.user.sub);
  }
}
