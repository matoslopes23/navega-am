// src/modules/real-time/real-time.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TripsGateway } from './infrastructure/gateways/trips.gateway';
import { RealTimeService } from './application/services/real-time.service';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
    imports: [forwardRef(() => TrackingModule)],
    providers: [TripsGateway, RealTimeService],
    exports: [RealTimeService], // Exporta apenas o serviço para o resto da aplicação
})
export class RealTimeModule { }