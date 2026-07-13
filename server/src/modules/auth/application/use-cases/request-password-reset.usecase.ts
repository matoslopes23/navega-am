import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'node:crypto';
import type { UserRepository } from '@modules/users/application/ports/user.repository';
import type { UserManagementRepository } from '@modules/users/application/ports/user-management.repository';
import {
  USER_MANAGEMENT_REPOSITORY,
  USER_REPOSITORY,
} from '@modules/users/users.tokens';
import type { PasswordResetDeliveryPort } from '../ports/password-reset-delivery.port';
import { PASSWORD_RESET_DELIVERY } from '../../auth.tokens';

@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly users: UserRepository,
    @Inject(USER_MANAGEMENT_REPOSITORY)
    private readonly management: UserManagementRepository,
    @Inject(PASSWORD_RESET_DELIVERY)
    private readonly delivery: PasswordResetDeliveryPort,
    private readonly config: ConfigService,
  ) {}

  async execute(emailValue: string) {
    const message =
      'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.';
    const email = emailValue.trim().toLowerCase();
    const user = await this.users.findByEmail(email);
    if (!user) return { message };

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await this.management.createPasswordResetToken(
      user.id,
      tokenHash,
      expiresAt,
    );

    const baseUrl = this.config.get<string>(
      'PASSWORD_RESET_BASE_URL',
      'http://localhost:5173/reset-password',
    );
    const resetUrl = `${baseUrl}?token=${encodeURIComponent(token)}`;
    await this.delivery.send({ email: user.email, name: user.name, resetUrl });

    return this.config.get<string>('NODE_ENV') === 'development'
      ? { message, resetToken: token }
      : { message };
  }
}
