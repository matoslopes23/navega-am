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
        clientPointId: loc.clientPointId,
        accuracy: loc.accuracy,
        speed: loc.speed,
        heading: loc.heading,
        accepted:
          (loc.accuracy === undefined || loc.accuracy <= 2000) &&
          (loc.speed === undefined || loc.speed <= 55),
        rejectionReason:
          loc.accuracy !== undefined && loc.accuracy > 2000
            ? 'LOW_ACCURACY'
            : loc.speed !== undefined && loc.speed > 55
              ? 'IMPOSSIBLE_SPEED'
              : undefined,
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

      const context = await this.repository.getTripTrackingContext(tripId);
      const toRadians = (value: number) => (value * Math.PI) / 180;
      const distanceKm = (
        fromLat: number,
        fromLng: number,
        toLat: number,
        toLng: number,
      ) => {
        const earthRadiusKm = 6371;
        const deltaLat = toRadians(toLat - fromLat);
        const deltaLng = toRadians(toLng - fromLng);
        const a =
          Math.sin(deltaLat / 2) ** 2 +
          Math.cos(toRadians(fromLat)) *
            Math.cos(toRadians(toLat)) *
            Math.sin(deltaLng / 2) ** 2;
        return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };

      const reportedSpeeds = locations
        .map((location) => location.speed)
        .filter((speed): speed is number => speed !== undefined);
      let speedKmh = reportedSpeeds.length
        ? median(reportedSpeeds) * 3.6
        : undefined;
      if (!speedKmh && context?.lastLocation) {
        const elapsedHours =
          (Date.now() - context.lastLocation.calculatedAt.getTime()) /
          3_600_000;
        if (elapsedHours > 0) {
          speedKmh =
            distanceKm(
              context.lastLocation.latitude,
              context.lastLocation.longitude,
              latitude,
              longitude,
            ) / elapsedHours;
        }
      }

      let progressPercent: number | undefined;
      let remainingDistanceKm: number | undefined;
      let estimatedArrival: Date | undefined;
      if (
        context?.originLatitude != null &&
        context.originLongitude != null &&
        context.destinationLatitude != null &&
        context.destinationLongitude != null
      ) {
        const directTotalDistance = distanceKm(
          context.originLatitude,
          context.originLongitude,
          context.destinationLatitude,
          context.destinationLongitude,
        );
        const totalDistance = context.routeDistanceKm ?? directTotalDistance;
        remainingDistanceKm = context.routeDistanceKm
          ? Math.max(
              0,
              totalDistance -
                distanceKm(
                  context.originLatitude,
                  context.originLongitude,
                  latitude,
                  longitude,
                ),
            )
          : distanceKm(
              latitude,
              longitude,
              context.destinationLatitude,
              context.destinationLongitude,
            );
        if (totalDistance > 0) {
          progressPercent = Math.max(
            0,
            Math.min(100, (1 - remainingDistanceKm / totalDistance) * 100),
          );
        }
        if (speedKmh && speedKmh >= 1) {
          estimatedArrival = new Date(
            Date.now() + (remainingDistanceKm / speedKmh) * 3_600_000,
          );
        }
      }

      let confidenceLevel: ConfidenceLevel = 'BAIXO';
      if (recentLocations.length >= 10) confidenceLevel = 'ALTO';
      else if (recentLocations.length >= 3) confidenceLevel = 'MEDIO';
      const boatLocationData = {
        tripId,
        latitude,
        longitude,
        confidenceLevel,
        calculatedAt: new Date(),
        contributorCount: recentLocations.length,
        speedKmh,
        progressPercent,
        remainingDistanceKm,
        estimatedArrival,
      };

      await this.repository.saveBoatLocationAndUpdateTrip(boatLocationData);
      await this.repository.recordNearbyPortApproach(
        tripId,
        latitude,
        longitude,
      );
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
