import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { USER_REPOSITORY } from '@modules/users/users.tokens';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import { LoginResult } from '@modules/auth/application/dto/login-result.dto';

export type LoginUserInput = {
  identifier: string;
  password: string;
};

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginUserInput): Promise<LoginResult> {
    const user = await this.users.findByEmailOrPhone(input.identifier);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        cpf: user.cpf,
      },
    };
  }
}
