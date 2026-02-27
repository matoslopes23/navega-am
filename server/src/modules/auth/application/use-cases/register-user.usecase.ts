import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { USER_REPOSITORY } from '@modules/users/users.tokens';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import { LoginResult } from '@modules/auth/application/dto/login-result.dto';
import { JwtService } from '@nestjs/jwt';

export type RegisterUserInput = {
  name: string;
  email: string;
  phone?: string | null;
  cpf: string;
  password: string;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: RegisterUserInput): Promise<LoginResult> {
    const existingEmail = await this.users.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const existingCpf = await this.users.findByCpf(input.cpf);
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado.');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      cpf: input.cpf,
      passwordHash,
    });

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
