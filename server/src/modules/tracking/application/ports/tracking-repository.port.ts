import { ConfidenceLevel } from '../../domain/boat-location';

export interface RawLocationInput {
  tripId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  pingedAt: Date;
  clientPointId?: string;
  accuracy?: number;
  speed?: number;
  heading?: number;
  accepted?: boolean;
  rejectionReason?: string;
}

export interface SaveBoatLocationInput {
  tripId: string;
  latitude: number;
  longitude: number;
  confidenceLevel: ConfidenceLevel;
  calculatedAt: Date;
  contributorCount: number;
  speedKmh?: number;
  progressPercent?: number;
  remainingDistanceKm?: number;
  estimatedArrival?: Date;
}

export interface RecentLocation {
  latitude: number;
  longitude: number;
}

export interface TripTrackingContext {
  originLatitude: number | null;
  originLongitude: number | null;
  destinationLatitude: number | null;
  destinationLongitude: number | null;
  routeDistanceKm: number | null;
  lastLocation: {
    latitude: number;
    longitude: number;
    calculatedAt: Date;
  } | null;
}

export interface TrackingRepositoryPort {
  saveRawLocations(data: RawLocationInput[]): Promise<void>;
  getRecentUniqueLocations(
    tripId: string,
    since: Date,
  ): Promise<RecentLocation[]>;
  saveBoatLocationAndUpdateTrip(data: SaveBoatLocationInput): Promise<void>;
  getTripTrackingContext(tripId: string): Promise<TripTrackingContext | null>;
  recordNearbyPortApproach(
    tripId: string,
    latitude: number,
    longitude: number,
  ): Promise<void>;
}
