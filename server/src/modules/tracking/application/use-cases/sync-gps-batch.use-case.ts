import { BadRequestException, Injectable, Inject } from '@nestjs/common';

import { SyncGpsDto } from '../dto/sync-gps.dto';

import type { TrackingQueuePort } from '../ports/tracking-queue.port';
import { TrackingTokens } from '../../tracking.tokens';

@Injectable()
export class SyncGpsBatchUseCase {
  constructor(
    @Inject(TrackingTokens.TRACKING_QUEUE_PORT)
    private readonly queue: TrackingQueuePort,
  ) {}

  async execute(dto: SyncGpsDto): Promise<void> {
    const now = Date.now();
    const oldestAccepted = now - 7 * 24 * 60 * 60 * 1000;
    const newestAccepted = now + 5 * 60 * 1000;
    const hasInvalidTimestamp = dto.locations.some(({ pingedAt }) => {
      const timestamp = Date.parse(pingedAt);
      return timestamp < oldestAccepted || timestamp > newestAccepted;
    });
    if (hasInvalidTimestamp) {
      throw new BadRequestException(
        'As localizações devem ter sido capturadas nos últimos 7 dias e não podem estar no futuro.',
      );
    }
    await this.queue.addBatchProcessJob(dto);
  }
}
