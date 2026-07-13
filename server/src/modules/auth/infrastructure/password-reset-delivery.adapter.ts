import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PasswordResetDeliveryPort } from '../application/ports/password-reset-delivery.port';

@Injectable()
export class PasswordResetDeliveryAdapter implements PasswordResetDeliveryPort {
  private readonly logger = new Logger(PasswordResetDeliveryAdapter.name);

  constructor(private readonly config: ConfigService) {}

  async send(input: { email: string; name: string; resetUrl: string }) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    if (!apiKey || !from) {
      if (this.config.get<string>('NODE_ENV') !== 'production') {
        this.logger.warn(
          `Recuperação de senha para ${input.email}: ${input.resetUrl}`,
        );
      } else {
        this.logger.error(
          'E-mail de recuperação não enviado: RESEND_API_KEY/EMAIL_FROM ausentes.',
        );
      }
      return;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: 'Recuperação de senha — Navega AM',
        html: `<p>Olá, ${this.escape(input.name)}.</p><p>Use o link abaixo para redefinir sua senha. Ele expira em 30 minutos e pode ser usado uma única vez.</p><p><a href="${this.escape(input.resetUrl)}">Redefinir senha</a></p><p>Se você não solicitou a alteração, ignore esta mensagem.</p>`,
      }),
    });
    if (!response.ok) {
      const details = await response.text();
      this.logger.error(
        `Falha ao enviar recuperação de senha (${response.status}): ${details}`,
      );
    }
  }

  private escape(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
