import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/presentation/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ManageUsersAdminUseCase } from '../application/use-cases/manage-users-admin.usecase';
import { UpdateUserRoleDto } from './dto/admin-users.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiTags('Operations')
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly manageUsers: ManageUsersAdminUseCase) {}

  @Get('users')
  @ApiOperation({ summary: 'Lista usuários (ADMIN)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  users(@Query('page') pageValue?: string) {
    const page = Math.max(1, Number(pageValue) || 1);
    return this.manageUsers.list(page);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Altera papel de um usuário e registra auditoria' })
  @ApiParam({ name: 'id', format: 'uuid' })
  role(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserRoleDto,
    @Req() req: Request & { user: AuthUser },
  ) {
    return this.manageUsers.changeRole(id, body.role, req.user.sub);
  }

  @Get('audit-logs')
  @ApiOperation({
    summary: 'Lista os 100 registros de auditoria mais recentes',
  })
  audits() {
    return this.manageUsers.audits();
  }
}
