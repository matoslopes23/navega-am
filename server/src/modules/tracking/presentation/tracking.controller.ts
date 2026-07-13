import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SyncGpsBatchUseCase } from '../application/use-cases/sync-gps-batch.use-case';
import { SyncGpsDto } from '../application/dto/sync-gps.dto';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { TrackingParticipationService } from '../application/services/tracking-participation.service';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(
    private readonly syncGpsBatchUseCase: SyncGpsBatchUseCase,
    private readonly participation: TrackingParticipationService,
  ) {}

  @Post('sync')
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
}
