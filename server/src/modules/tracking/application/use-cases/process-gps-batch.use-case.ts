import { Injectable, Inject, Logger } from '@nestjs/common';

import type { TrackingRepositoryPort } from '../ports/tracking-repository.port';
import type { RealTimeEmitterPort } from '../ports/real-time-emitter.port';
import { SyncGpsDto } from '../dto/sync-gps.dto';
import { ConfidenceLevel } from '../../domain/boat-location';
import { TrackingTokens } from '../../tracking.tokens';

@Injectable()
export class ProcessGpsBatchUseCase {
    private readonly logger = new Logger(ProcessGpsBatchUseCase.name);

    constructor(
        @Inject(TrackingTokens.TRACKING_REPOSITORY_PORT)
        private readonly repository: TrackingRepositoryPort,

        @Inject(TrackingTokens.REAL_TIME_EMITTER_PORT)
        private readonly realTimeEmitter: RealTimeEmitterPort,
    ) { }

    async execute(payload: SyncGpsDto): Promise<void> {
        const { tripId, deviceId, locations } = payload;
        console.log('Processing batch: ', payload);
        if (!locations || locations.length === 0) return;

        try {
            const rawData = locations.map((loc) => ({
                tripId,
                deviceId,
                latitude: loc.latitude,
                longitude: loc.longitude,
                pingedAt: new Date(loc.pingedAt),
            }));
            console.log('Raw data: ', rawData);
            await this.repository.saveRawLocations(rawData);
            console.log('Raw data saved: ', rawData);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            console.log('Five minutes ago: ', fiveMinutesAgo);
            const recentLocations = await this.repository.getRecentUniqueLocations(tripId, fiveMinutesAgo);
            console.log('Recent locations: ', recentLocations);
            if (recentLocations.length === 0) return;
            console.log('Recent locations length: ', recentLocations.length);
            const totalLat = recentLocations.reduce((sum, loc) => sum + loc.latitude, 0);
            console.log('Total lat: ', totalLat);
            const totalLng = recentLocations.reduce((sum, loc) => sum + loc.longitude, 0);
            console.log('Total lng: ', totalLng);
            const avgLatitude = totalLat / recentLocations.length;
            console.log('Avg latitude: ', avgLatitude);
            const avgLongitude = totalLng / recentLocations.length;
            console.log('Avg longitude: ', avgLongitude);

            let confidenceLevel: ConfidenceLevel = 'BAIXO';
            if (recentLocations.length >= 10) confidenceLevel = 'ALTO';
            else if (recentLocations.length >= 3) confidenceLevel = 'MEDIO';
            console.log('Confidence level: ', confidenceLevel);
            const boatLocationData = {
                tripId,
                latitude: avgLatitude,
                longitude: avgLongitude,
                confidenceLevel,
                calculatedAt: new Date(),
            };

            console.log('Boat location data: ', boatLocationData);

            await this.repository.saveBoatLocationAndUpdateTrip(boatLocationData);
            this.realTimeEmitter.emitLocationUpdate(tripId, boatLocationData);
            console.log('Location updated: ', boatLocationData);

        } catch (error) {
            this.logger.error(`Erro ao processar lote de GPS para viagem ${tripId}`, error.stack);
            throw error;
        }
    }
}