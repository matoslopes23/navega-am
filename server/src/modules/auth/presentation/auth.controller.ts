import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginUserUseCase } from '@modules/auth/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@modules/auth/application/use-cases/register-user.usecase';
import { LoginUserDto } from '@modules/auth/presentation/dto/login-user.dto';
import { RegisterUserDto } from '@modules/auth/presentation/dto/register-user.dto';
import { AuthResponseDto } from '@modules/auth/presentation/dto/auth-response.dto';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import { RequestPasswordResetUseCase } from '../application/use-cases/request-password-reset.usecase';
import { ResetPasswordUseCase } from '../application/use-cases/reset-password.usecase';
import {
  PasswordResetRequestedResponseDto,
  PasswordResetResponseDto,
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dto/password-reset.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly requestPasswordReset: RequestPasswordResetUseCase,
    private readonly resetPassword: ResetPasswordUseCase,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Cadastra usuário e retorna JWT',
    description:
      'Normaliza e-mail, CPF e telefone. A senha deve conter maiúscula, minúscula e número.',
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail, CPF ou telefone já cadastrado.',
  })
  @UseGuards(RateLimitGuard)
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso.',
    type: AuthResponseDto,
  })
  register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Autentica por e-mail ou telefone' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @UseGuards(RateLimitGuard)
  @ApiOkResponse({
    description: 'Login realizado com sucesso.',
    type: AuthResponseDto,
  })
  login(@Body() body: LoginUserDto) {
    return this.loginUser.execute(body);
  }

  @Post('forgot-password')
  @UseGuards(RateLimitGuard)
  @ApiOperation({
    summary: 'Solicita recuperação de senha',
    description:
      'Sempre retorna a mesma mensagem para não revelar se o e-mail está cadastrado. O token expira em 30 minutos.',
  })
  @ApiOkResponse({ type: PasswordResetRequestedResponseDto })
  forgotPassword(@Body() body: RequestPasswordResetDto) {
    return this.requestPasswordReset.execute(body.email);
  }

  @Post('reset-password')
  @UseGuards(RateLimitGuard)
  @ApiOperation({
    summary: 'Redefine a senha usando token de uso único',
  })
  @ApiOkResponse({ type: PasswordResetResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Token inválido, expirado ou utilizado.',
  })
  reset(@Body() body: ResetPasswordDto) {
    return this.resetPassword.execute(body.token, body.password);
  }
}
