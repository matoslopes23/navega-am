import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  start(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.start(tripId, req.user.sub);
  }

  @Post('heartbeat')
  heartbeat(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.heartbeat(tripId, req.user.sub);
  }

  @Post('stop')
  stop(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.stop(tripId, req.user.sub);
  }

  @Get('status')
  status(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.status(tripId, req.user.sub);
  }
}
