import { Inject, Injectable } from '@nestjs/common';
import type { TripsRepository } from '../ports/trips.repository';
import { TRIPS_REPOSITORY } from '../../trips.tokens';

@Injectable()
export class GetTripHistoryUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly trips: TripsRepository,
  ) {}
  locations(tripId: string, page: number) {
    return this.trips.getLocationHistory(tripId, page);
  }
  timeline(tripId: string) {
    return this.trips.getTimeline(tripId);
  }
}
