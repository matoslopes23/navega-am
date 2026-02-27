import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { LoginUserUseCase } from '@modules/auth/application/use-cases/login-user.usecase';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import type { User } from '@modules/users/domain/user';

describe('LoginUserUseCase', () => {
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
  let useCase: LoginUserUseCase;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      findByCpf: jest.fn(),
      findByEmailOrPhone: jest.fn(),
      create: jest.fn(),
    };
    jwtService = { signAsync: jest.fn() } as unknown as JwtService;
    useCase = new LoginUserUseCase(repository, jwtService);
  });

  it('throws when user is not found', async () => {
    repository.findByEmailOrPhone.mockResolvedValue(null);

    await expect(
      useCase.execute({ identifier: 'joao@email.com', password: 'Senha@123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('throws when password is invalid', async () => {
    repository.findByEmailOrPhone.mockResolvedValue(baseUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      useCase.execute({ identifier: baseUser.email, password: 'Senha@123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns token when credentials are valid', async () => {
    repository.findByEmailOrPhone.mockResolvedValue(baseUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwtService.signAsync as jest.Mock).mockResolvedValue('token');

    const result = await useCase.execute({
      identifier: baseUser.email,
      password: 'Senha@123',
    });

    expect(result.accessToken).toBe('token');
    expect(result.user.email).toBe(baseUser.email);
  });
});
