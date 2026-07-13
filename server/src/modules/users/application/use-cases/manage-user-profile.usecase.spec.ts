import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import type { UserManagementRepository } from '../ports/user-management.repository';
import { ManageUserProfileUseCase } from './manage-user-profile.usecase';

describe('ManageUserProfileUseCase', () => {
  const findById = jest.fn();
  const updatePassword = jest.fn();
  const updateProfile = jest.fn();
  const users = {
    findById,
    updatePassword,
    updateProfile,
  } as unknown as jest.Mocked<UserManagementRepository>;
  const useCase = new ManageUserProfileUseCase(users);

  beforeEach(() => jest.clearAllMocks());

  it('normaliza nome e telefone ao atualizar o perfil', async () => {
    users.updateProfile.mockResolvedValue({ id: 'user-1' });
    await useCase.update('user-1', {
      name: '  Maria Silva  ',
      phone: '(92) 99999-9999',
    });
    expect(updateProfile).toHaveBeenCalledWith('user-1', {
      name: 'Maria Silva',
      phone: '92999999999',
    });
  });

  it('rejeita alteração quando a senha atual é inválida', async () => {
    users.findById.mockResolvedValue({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      cpf: '1',
      passwordHash: await bcrypt.hash('SenhaCorreta1', 4),
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(
      useCase.changePassword('user-1', 'SenhaErrada1', 'NovaSenha123'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(updatePassword).not.toHaveBeenCalled();
  });

  it('salva somente o hash da nova senha', async () => {
    users.findById.mockResolvedValue({
      id: 'user-1',
      name: 'Maria',
      email: 'maria@example.com',
      cpf: '1',
      passwordHash: await bcrypt.hash('SenhaCorreta1', 4),
      role: 'USER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await expect(
      useCase.changePassword('user-1', 'SenhaCorreta1', 'NovaSenha123'),
    ).resolves.toEqual({ changed: true });
    const savedHash = updatePassword.mock.calls[0][1] as string;
    expect(savedHash).not.toBe('NovaSenha123');
    await expect(bcrypt.compare('NovaSenha123', savedHash)).resolves.toBe(true);
  });
});
