import { ConfigService } from '@nestjs/config';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import type { UserManagementRepository } from '@modules/users/application/ports/user-management.repository';
import type { PasswordResetDeliveryPort } from '../ports/password-reset-delivery.port';
import { RequestPasswordResetUseCase } from './request-password-reset.usecase';

describe('RequestPasswordResetUseCase', () => {
  const findByEmail = jest.fn();
  const createPasswordResetToken = jest.fn();
  const send = jest.fn();
  const users = { findByEmail } as unknown as UserRepository;
  const management = {
    createPasswordResetToken,
  } as unknown as UserManagementRepository;
  const delivery = { send } as PasswordResetDeliveryPort;
  const config = {
    get: jest.fn((key: string, fallback?: string) =>
      key === 'NODE_ENV' ? 'test' : fallback,
    ),
  } as unknown as ConfigService;
  const useCase = new RequestPasswordResetUseCase(
    users,
    management,
    delivery,
    config,
  );

  beforeEach(() => jest.clearAllMocks());

  it('não revela quando o e-mail não existe', async () => {
    findByEmail.mockResolvedValue(null);
    const result = await useCase.execute('unknown@example.com');
    expect(result).toEqual({
      message:
        'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.',
    });
    expect(createPasswordResetToken).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('persiste somente o hash e envia o token no link', async () => {
    findByEmail.mockResolvedValue({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
    });
    createPasswordResetToken.mockResolvedValue(undefined);
    send.mockResolvedValue(undefined);
    await useCase.execute(' MARIA@EXAMPLE.COM ');
    expect(findByEmail).toHaveBeenCalledWith('maria@example.com');
    const storedHash = createPasswordResetToken.mock.calls[0][1] as string;
    expect(storedHash).toHaveLength(64);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'maria@example.com',
        resetUrl: expect.stringContaining('?token='),
      }),
    );
  });
});
