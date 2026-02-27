/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { RegisterUserUseCase } from '@modules/auth/application/use-cases/register-user.usecase';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import type { User } from '@modules/users/domain/user';

describe('RegisterUserUseCase', () => {
  const baseUser: User = {
    id: 'user-1',
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '(92) 99999-9999',
    cpf: '000.000.000-00',
    passwordHash: 'hashed',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let repository: jest.Mocked<UserRepository>;
  let jwtService: JwtService;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      create: jest.fn(),
    };
    jwtService = { signAsync: jest.fn() } as unknown as JwtService;
    useCase = new RegisterUserUseCase(repository, jwtService);
  });

  it('throws when email already exists', async () => {
    repository.findByEmail.mockResolvedValue(baseUser);

    await expect(
      useCase.execute({
        name: 'João da Silva',
        email: baseUser.email,
        phone: baseUser.phone,
        cpf: baseUser.cpf,
        password: 'Senha@123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when cpf already exists', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.findByCpf.mockResolvedValue(baseUser);

    await expect(
      useCase.execute({
        name: 'João da Silva',
        email: baseUser.email,
        phone: baseUser.phone,
        cpf: baseUser.cpf,
        password: 'Senha@123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('registers a new user and returns token', async () => {
    repository.findByEmail.mockResolvedValue(null);
    repository.findByCpf.mockResolvedValue(null);
    repository.create.mockResolvedValue(baseUser);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await useCase.execute({
      name: baseUser.name,
      email: baseUser.email,
      phone: baseUser.phone,
      cpf: baseUser.cpf,
      password: 'Senha@123',
    });

    expect(repository.create).toHaveBeenCalledWith({
      name: baseUser.name,
      email: baseUser.email,
      phone: baseUser.phone,
      cpf: baseUser.cpf,
      passwordHash: 'hashed',
    });
    expect(result.accessToken).toBe('token');
    expect(result.user.email).toBe(baseUser.email);
  });
});
