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

export interface TripsRepository {
  search(filters: TripsSearchFilters): Promise<Trip[]>;
  findDetailsById(id: string): Promise<TripDetails | null>;
  updateContribution(
    id: string,
    data: {
      userDepartureDate?: Date;
      userDepartureTime?: string;
    },
  ): Promise<TripDetails | null>;
}
