import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { TrackingQueuePort } from '../../application/ports/tracking-queue.port';
import { SyncGpsDto } from '../../application/dto/sync-gps.dto';

@Injectable()
export class BullTrackingQueueAdapter implements TrackingQueuePort {
  constructor(
    @InjectQueue('gps-processing') private readonly gpsQueue: Queue,
  ) {}

  async addBatchProcessJob(data: SyncGpsDto): Promise<void> {
    await this.gpsQueue.add('process-batch', data);
  }
}
