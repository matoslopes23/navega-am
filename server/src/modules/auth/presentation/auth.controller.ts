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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
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
}
