import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import type { UserManagementRepository } from '@modules/users/application/ports/user-management.repository';
import { USER_MANAGEMENT_REPOSITORY } from '@modules/users/users.tokens';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly users: UserManagementRepository,
  ) {}

  async execute(token: string, password: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const passwordHash = await bcrypt.hash(password, 12);
    const changed = await this.users.resetPasswordWithToken(
      tokenHash,
      passwordHash,
      new Date(),
    );
    if (!changed) {
      throw new BadRequestException(
        'Token inválido, expirado ou já utilizado.',
      );
    }
    return { changed: true };
  }
}
