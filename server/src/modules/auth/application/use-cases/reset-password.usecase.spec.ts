import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { UserManagementRepository } from '@modules/users/application/ports/user-management.repository';
import { ResetPasswordUseCase } from './reset-password.usecase';

describe('ResetPasswordUseCase', () => {
  const resetPasswordWithToken = jest.fn();
  const users = {
    resetPasswordWithToken,
  } as unknown as UserManagementRepository;
  const useCase = new ResetPasswordUseCase(users);

  beforeEach(() => jest.clearAllMocks());

  it('rejeita token inválido ou expirado', async () => {
    resetPasswordWithToken.mockResolvedValue(false);
    await expect(
      useCase.execute('a'.repeat(64), 'NovaSenha123'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('envia apenas hashes ao repositório', async () => {
    resetPasswordWithToken.mockResolvedValue(true);
    await expect(
      useCase.execute('a'.repeat(64), 'NovaSenha123'),
    ).resolves.toEqual({
      changed: true,
    });
    const [tokenHash, passwordHash] = resetPasswordWithToken.mock.calls[0] as [
      string,
      string,
    ];
    expect(tokenHash).not.toBe('a'.repeat(64));
    await expect(bcrypt.compare('NovaSenha123', passwordHash)).resolves.toBe(
      true,
    );
  });
});
