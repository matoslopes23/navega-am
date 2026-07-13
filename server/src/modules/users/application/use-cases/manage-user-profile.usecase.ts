import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { UserManagementRepository } from '../ports/user-management.repository';
import { USER_MANAGEMENT_REPOSITORY } from '../../users.tokens';

@Injectable()
export class ManageUserProfileUseCase {
  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly users: UserManagementRepository,
  ) {}

  profile(userId: string) {
    return this.users.getProfile(userId);
  }

  update(userId: string, input: { name?: string; phone?: string }) {
    return this.users.updateProfile(userId, {
      name: input.name?.trim(),
      phone: input.phone?.replace(/\D/g, ''),
    });
  }

  consent(userId: string, consent: boolean) {
    return this.users.updateLocationConsent(userId, consent, new Date());
  }

  exportData(userId: string) {
    return this.users.exportData(userId);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.users.findById(userId);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      throw new UnauthorizedException('Senha atual inválida.');
    }
    await this.users.updatePassword(userId, await bcrypt.hash(newPassword, 12));
    return { changed: true };
  }

  async remove(userId: string) {
    await this.users.delete(userId);
    return { deleted: true };
  }
}
