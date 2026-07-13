import { ConfidenceLevel } from '../../domain/boat-location';

export interface RawLocationInput {
  tripId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  pingedAt: Date;
}

export interface SaveBoatLocationInput {
  tripId: string;
  latitude: number;
  longitude: number;
  confidenceLevel: ConfidenceLevel;
  calculatedAt: Date;
}

export interface RecentLocation {
  latitude: number;
  longitude: number;
}

export interface TrackingRepositoryPort {
  saveRawLocations(data: RawLocationInput[]): Promise<void>;
  getRecentUniqueLocations(
    tripId: string,
    since: Date,
  ): Promise<RecentLocation[]>;
  saveBoatLocationAndUpdateTrip(data: SaveBoatLocationInput): Promise<void>;
}
