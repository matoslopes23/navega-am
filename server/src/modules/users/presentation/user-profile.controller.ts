import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUser } from '@modules/auth/application/auth-user';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManageUserProfileUseCase } from '../application/use-cases/manage-user-profile.usecase';
import {
  ChangePasswordDto,
  ConsentDto,
  UpdateProfileDto,
} from './dto/user-profile.dto';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
@ApiTags('Users')
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly manageProfile: ManageUserProfileUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Consulta o perfil autenticado' })
  profile(@Req() req: Request & { user: AuthUser }) {
    return this.manageProfile.profile(req.user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Atualiza nome e telefone' })
  update(
    @Req() req: Request & { user: AuthUser },
    @Body() body: UpdateProfileDto,
  ) {
    return this.manageProfile.update(req.user.sub, body);
  }

  @Patch('location-consent')
  @ApiOperation({ summary: 'Concede ou revoga consentimento de localização' })
  consent(@Req() req: Request & { user: AuthUser }, @Body() body: ConsentDto) {
    return this.manageProfile.consent(req.user.sub, body.consent);
  }

  @Get('export')
  @ApiOperation({ summary: 'Exporta dados pessoais e contribuições (LGPD)' })
  exportData(@Req() req: Request & { user: AuthUser }) {
    return this.manageProfile.exportData(req.user.sub);
  }

  @Post('change-password')
  @ApiOperation({
    summary: 'Altera a senha mediante confirmação da senha atual',
  })
  async changePassword(
    @Req() req: Request & { user: AuthUser },
    @Body() body: ChangePasswordDto,
  ) {
    return this.manageProfile.changePassword(
      req.user.sub,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Delete()
  @ApiOperation({
    summary: 'Exclui definitivamente a conta e dados relacionados',
  })
  @ApiResponse({ status: 200, description: 'Conta excluída.' })
  async remove(@Req() req: Request & { user: AuthUser }) {
    return this.manageProfile.remove(req.user.sub);
  }
}
