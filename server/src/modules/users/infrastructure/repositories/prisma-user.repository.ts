import { Injectable } from '@nestjs/common';

import { PrismaService } from '@shared/prisma/prisma.service';
import { UserRepository } from '@modules/users/application/ports/user.repository';
import { User } from '@modules/users/domain/user';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { cpf } });
  }

  findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  }

  create(data: {
    name: string;
    email: string;
    phone?: string | null;
    cpf: string;
    passwordHash: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}
