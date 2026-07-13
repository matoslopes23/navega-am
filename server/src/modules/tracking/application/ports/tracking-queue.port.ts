import { SyncGpsDto } from '../dto/sync-gps.dto';

export interface TrackingQueuePort {
  addBatchProcessJob(data: SyncGpsDto): Promise<void>;
}
