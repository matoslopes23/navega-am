import { Injectable, Inject } from '@nestjs/common';

import { SyncGpsDto } from '../dto/sync-gps.dto';

import type { TrackingQueuePort } from '../ports/tracking-queue.port';
import { TrackingTokens } from '../../tracking.tokens';

@Injectable()
export class SyncGpsBatchUseCase {
    constructor(
        @Inject(TrackingTokens.TRACKING_QUEUE_PORT)
        private readonly queue: TrackingQueuePort,
    ) { }

    async execute(dto: SyncGpsDto): Promise<void> {
        await this.queue.addBatchProcessJob(dto);
    }
}