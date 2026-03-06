import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginUserUseCase } from '@modules/auth/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@modules/auth/application/use-cases/register-user.usecase';
import { LoginUserDto } from '@modules/auth/presentation/dto/login-user.dto';
import { RegisterUserDto } from '@modules/auth/presentation/dto/register-user.dto';
import { AuthResponseDto } from '@modules/auth/presentation/dto/auth-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
  ) {}

  @Post('register')
  @ApiCreatedResponse({
    description: 'Usuário cadastrado com sucesso.',
    type: AuthResponseDto,
  })
  register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute(body);
  }

  @Post('login')
  @ApiOkResponse({
    description: 'Login realizado com sucesso.',
    type: AuthResponseDto,
  })
  login(@Body() body: LoginUserDto) {
    return this.loginUser.execute(body);
  }
}
