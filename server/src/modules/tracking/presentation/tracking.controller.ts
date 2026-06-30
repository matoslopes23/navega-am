import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SyncGpsBatchUseCase } from '../application/use-cases/sync-gps-batch.use-case';
import { SyncGpsDto } from '../application/dto/sync-gps.dto';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly syncGpsBatchUseCase: SyncGpsBatchUseCase) { }

    @Post('sync')
    @HttpCode(HttpStatus.ACCEPTED)
    async syncLocations(@Body() dto: SyncGpsDto) {
        console.log('Controller hit! Received DTO:', dto);
        await this.syncGpsBatchUseCase.execute(dto);
        console.log('Job enqueued successfully!');
        return { message: 'Batch received and queued for processing' };
    }
}