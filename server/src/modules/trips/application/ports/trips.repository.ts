import { Trip } from '@modules/trips/domain/trip';
import { TripDetails } from '@modules/trips/domain/trip-details';

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
}
