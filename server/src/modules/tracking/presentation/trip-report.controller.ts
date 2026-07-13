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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  create(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Body() body: CreateTripReportDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.create(tripId, req.user.sub, body);
  }

  @Post('manual-position')
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
  summary(@Param('tripId', ParseUUIDPipe) tripId: string) {
    return this.service.summary(tripId);
  }

  @Patch(':reportId/moderate')
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
