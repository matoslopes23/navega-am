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
    const email = input.email.trim().toLowerCase();
    const cpf = input.cpf.replace(/\D/g, '');
    const phone = input.phone?.replace(/\D/g, '') || null;
    const existingEmail = await this.users.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const existingCpf = await this.users.findByCpf(cpf);
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado.');
    }

    if (phone && (await this.users.findByEmailOrPhone(phone))) {
      throw new ConflictException('Telefone já cadastrado.');
    }
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.users.create({
      name: input.name,
      email,
      phone,
      cpf,
      passwordHash,
    });

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}
