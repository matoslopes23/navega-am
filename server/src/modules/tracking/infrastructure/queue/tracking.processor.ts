import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { ProcessGpsBatchUseCase } from '../../application/use-cases/process-gps-batch.use-case';
import { SyncGpsDto } from '../../application/dto/sync-gps.dto';

@Processor('gps-processing')
@Injectable()
export class TrackingProcessor extends WorkerHost {
    constructor(private readonly processGpsBatchUseCase: ProcessGpsBatchUseCase) {
        super();
    }

    async process(job: Job<SyncGpsDto, any, string>): Promise<any> {
        if (job.name === 'process-batch') {
            console.log('Processando batch:', job.data);
            await this.processGpsBatchUseCase.execute(job.data);
        }
    }
}