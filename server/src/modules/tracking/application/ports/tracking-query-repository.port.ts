import { ConfidenceLevel } from '../../domain/boat-location';

export interface LastKnownLocation {
  latitude: number;
  longitude: number;
  confidenceLevel: ConfidenceLevel;
  calculatedAt: Date;
  contributorCount: number;
  speedKmh: number | null;
  progressPercent: number | null;
  remainingDistanceKm: number | null;
  estimatedArrival: Date | null;
}

export interface TrackingQueryRepositoryPort {
  getLastKnownLocation(tripId: string): Promise<LastKnownLocation | null>;
}
