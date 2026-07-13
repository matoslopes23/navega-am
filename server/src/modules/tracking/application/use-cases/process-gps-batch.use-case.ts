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
  ) {}

  async execute(payload: SyncGpsDto): Promise<void> {
    const { tripId, deviceId, locations } = payload;
    if (!locations || locations.length === 0) return;

    try {
      const rawData = locations.map((loc) => ({
        tripId,
        deviceId,
        latitude: loc.latitude,
        longitude: loc.longitude,
        pingedAt: new Date(loc.pingedAt),
      }));
      await this.repository.saveRawLocations(rawData);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const recentLocations = await this.repository.getRecentUniqueLocations(
        tripId,
        fiveMinutesAgo,
      );
      if (recentLocations.length === 0) return;
      const median = (values: number[]) => {
        const sorted = [...values].sort((a, b) => a - b);
        const middle = Math.floor(sorted.length / 2);
        return sorted.length % 2
          ? sorted[middle]
          : (sorted[middle - 1] + sorted[middle]) / 2;
      };
      const latitude = median(
        recentLocations.map((location) => location.latitude),
      );
      const longitude = median(
        recentLocations.map((location) => location.longitude),
      );

      let confidenceLevel: ConfidenceLevel = 'BAIXO';
      if (recentLocations.length >= 10) confidenceLevel = 'ALTO';
      else if (recentLocations.length >= 3) confidenceLevel = 'MEDIO';
      const boatLocationData = {
        tripId,
        latitude,
        longitude,
        confidenceLevel,
        calculatedAt: new Date(),
      };

      await this.repository.saveBoatLocationAndUpdateTrip(boatLocationData);
      this.realTimeEmitter.emitLocationUpdate(tripId, boatLocationData);
    } catch (error: unknown) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Erro ao processar lote de GPS para viagem ${tripId}`,
        stack,
      );
      throw error;
    }
  }
}
