import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlPingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(UrlPingService.name);
  private intervalId?: NodeJS.Timeout;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.get<string>('PING_URL');
    if (!url) {
      this.logger.warn('PING_URL não configurada. Ping automático desativado.');
      return;
    }

    const intervalMs =
      this.configService.get<number>('PING_INTERVAL_MS') ?? 20000;
    this.logger.log(
      `Ping automático habilitado: ${url} a cada ${intervalMs}ms.`,
    );

    this.intervalId = setInterval(() => {
      void this.ping(url);
    }, intervalMs);
  }

  private async ping(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        this.logger.warn(`Ping respondeu ${response.status} para ${url}.`);
      }
    } catch (error) {
      this.logger.error(
        `Falha no ping para ${url}.`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }
}
