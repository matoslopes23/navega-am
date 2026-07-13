import { Trip } from '@modules/trips/domain/trip';
import { TripDetails } from '@modules/trips/domain/trip-details';
import { ActiveTrip } from '@modules/trips/domain/active-trip';

export type TripsSearchFilters = {
  origin: string;
  destination: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  timeRange?: {
    from?: string;
    to?: string;
  };
  pagination: {
    skip: number;
    take: number;
  };
};

export type CreateTripInput = {
  boatName: string;
  boatType: string;
  price: number;
  origin: string;
  destination: string;
  departureDate: Date;
  departureTime: string;
  status?: 'em-transito' | 'no-porto' | 'programado';
  latitude: number;
  longitude: number;
  originLatitude?: number;
  originLongitude?: number;
  destinationLatitude?: number;
  destinationLongitude?: number;
  itinerary?: {
    name: string;
    type: 'saida' | 'escala' | 'destino';
    time: string;
    description: string;
    status?: string;
    order?: number;
  }[];
  accommodations?: {
    name: string;
    price: number;
    description?: string;
  }[];
};

export type CreatePortInput = {
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
};

export type CreateRiverRouteInput = {
  name: string;
  originName: string;
  destinationName: string;
  geometry: Record<string, unknown>;
  distanceKm?: number;
};

export interface TripsRepository {
  search(filters: TripsSearchFilters): Promise<Trip[]>;
  findDetailsById(id: string): Promise<TripDetails | null>;
  create(input: CreateTripInput): Promise<TripDetails>;
  updateContribution(
    id: string,
    data: {
      userDepartureDate?: Date;
      userDepartureTime?: string;
    },
  ): Promise<TripDetails | null>;
  listLocations(): Promise<{ origins: string[]; destinations: string[] }>;
  listActive(filters?: {
    origin?: string;
    destination?: string;
  }): Promise<ActiveTrip[]>;
  updateStatus(id: string, status: string): Promise<TripDetails | null>;
  listPorts(): Promise<unknown[]>;
  createPort(input: CreatePortInput): Promise<unknown>;
  listRiverRoutes(): Promise<unknown[]>;
  createRiverRoute(input: CreateRiverRouteInput): Promise<unknown>;
  assignRoute(tripId: string, routeId: string): Promise<unknown>;
  getLocationHistory(tripId: string, page: number): Promise<unknown[]>;
  getTimeline(tripId: string): Promise<unknown[]>;
}
