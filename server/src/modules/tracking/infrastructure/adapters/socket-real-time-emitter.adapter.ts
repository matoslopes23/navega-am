import { Injectable } from '@nestjs/common';
import { RealTimeEmitterPort } from '../../application/ports/real-time-emitter.port';
import { RealTimeService } from '@app/modules/real-time/application/services/real-time.service';

@Injectable()
export class SocketRealTimeEmitterAdapter implements RealTimeEmitterPort {
    constructor(private readonly realTimeService: RealTimeService) { }

    emitLocationUpdate(tripId: string, locationData: any): void {
        console.log('Location updated:', locationData);
        this.realTimeService.broadcastToTrip(tripId, 'boat_position_updated', locationData);
    }
}