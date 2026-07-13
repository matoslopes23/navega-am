import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { ProcessGpsBatchUseCase } from '../../application/use-cases/process-gps-batch.use-case';
import { SyncGpsDto } from '../../application/dto/sync-gps.dto';

@Processor('gps-processing')
@Injectable()
export class TrackingProcessor extends WorkerHost {
  private readonly logger = new Logger(TrackingProcessor.name);
  constructor(private readonly processGpsBatchUseCase: ProcessGpsBatchUseCase) {
    super();
  }

  async process(job: Job<SyncGpsDto, void, string>): Promise<void> {
    if (job.name === 'process-batch') {
      this.logger.debug(`Processando lote GPS ${job.id ?? 'sem-id'}`);
      await this.processGpsBatchUseCase.execute(job.data);
    }
  }
}
