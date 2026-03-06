import { Trip } from '@modules/trips/domain/trip';

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
}
