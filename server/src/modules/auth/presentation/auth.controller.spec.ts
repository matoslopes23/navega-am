/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';

import { AuthController } from '@modules/auth/presentation/auth.controller';
import { LoginUserUseCase } from '@modules/auth/application/use-cases/login-user.usecase';
import { RegisterUserUseCase } from '@modules/auth/application/use-cases/register-user.usecase';
import type { LoginUserDto } from '@modules/auth/presentation/dto/login-user.dto';
import type { RegisterUserDto } from '@modules/auth/presentation/dto/register-user.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let registerUseCase: RegisterUserUseCase;
  let loginUseCase: LoginUserUseCase;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: RegisterUserUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: LoginUserUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = moduleRef.get(AuthController);
    registerUseCase = moduleRef.get(RegisterUserUseCase);
    loginUseCase = moduleRef.get(LoginUserUseCase);
  });

  it('delegates register to use case', async () => {
    const payload: RegisterUserDto = {
      name: 'João',
      email: 'joao@email.com',
      phone: '(92) 99999-9999',
      cpf: '000.000.000-00',
      password: 'Senha@123',
    };
    (registerUseCase.execute as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      user: {
        id: 'user-1',
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        cpf: payload.cpf,
      },
    });

    const result = await controller.register(payload);

    expect(registerUseCase.execute).toHaveBeenCalledWith(payload);
    expect(result.accessToken).toBe('token');
  });

  it('delegates login to use case', async () => {
    const payload: LoginUserDto = {
      identifier: 'joao@email.com',
      password: 'Senha@123',
    };
    (loginUseCase.execute as jest.Mock).mockResolvedValue({
      accessToken: 'token',
      user: {
        id: 'user-1',
        name: 'João',
        email: 'joao@email.com',
        phone: '(92) 99999-9999',
        cpf: '000.000.000-00',
      },
    });

    const result = await controller.login(payload);

    expect(loginUseCase.execute).toHaveBeenCalledWith(payload);
    expect(result.accessToken).toBe('token');
  });
});
