import { Injectable } from '@nestjs/common';
import { TripsGateway } from '../../infrastructure/gateways/trips.gateway';

@Injectable()
export class RealTimeService {
    constructor(private readonly tripsGateway: TripsGateway) { }

    /**
     * Envia uma mensagem para todos os usuários conectados em uma viagem específica.
     */
    broadcastToTrip(tripId: string, eventName: string, payload: any): void {
        console.log('Broadcasting to trip:', tripId, eventName, payload);
        const room = `trip_${tripId}`;
        this.tripsGateway.server.to(room).emit(eventName, payload);
    }
}