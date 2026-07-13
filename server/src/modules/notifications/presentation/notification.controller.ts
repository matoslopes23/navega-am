import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { NotificationService } from '../application/notification.service';
import { RegisterDeviceDto } from './dto/register-device.dto';

@UseGuards(JwtAuthGuard)
@ApiTags('Notifications')
@ApiBearerAuth()
@Controller()
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('users/me/devices')
  @ApiOperation({ summary: 'Registra ou reativa um dispositivo para push' })
  @ApiResponse({ status: 201, description: 'Dispositivo registrado.' })
  device(
    @Body() body: RegisterDeviceDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.registerDevice(req.user.sub, body.token, body.platform);
  }

  @Post('trips/:tripId/subscriptions')
  @ApiOperation({ summary: 'Ativa alertas de uma viagem' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  subscribe(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.subscribe(req.user.sub, tripId);
  }

  @Delete('trips/:tripId/subscriptions')
  @ApiOperation({ summary: 'Desativa alertas de uma viagem' })
  @ApiParam({ name: 'tripId', format: 'uuid' })
  unsubscribe(
    @Param('tripId', ParseUUIDPipe) tripId: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.unsubscribe(req.user.sub, tripId);
  }

  @Get('users/me/notifications')
  @ApiOperation({
    summary: 'Lista notificações do usuário, mais recentes primeiro',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  list(@Req() req: Request & { user: AuthUser }, @Query('page') page?: string) {
    return this.service.list(req.user.sub, Math.max(1, Number(page) || 1));
  }

  @Get('users/me/subscriptions')
  @ApiOperation({ summary: 'Lista viagens acompanhadas pelo usuário' })
  subscriptions(@Req() req: Request & { user: AuthUser }) {
    return this.service.subscriptions(req.user.sub);
  }

  @Patch('users/me/notifications/:id/read')
  @ApiOperation({ summary: 'Marca uma notificação como lida' })
  @ApiParam({ name: 'id', format: 'uuid' })
  read(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.service.markRead(req.user.sub, id);
  }
}
