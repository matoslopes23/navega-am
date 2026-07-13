import { ConfidenceLevel } from '../../domain/boat-location';

export interface LastKnownLocation {
  latitude: number;
  longitude: number;
  confidenceLevel: ConfidenceLevel;
  calculatedAt: Date;
}

export interface TrackingQueryRepositoryPort {
  getLastKnownLocation(tripId: string): Promise<LastKnownLocation | null>;
}
