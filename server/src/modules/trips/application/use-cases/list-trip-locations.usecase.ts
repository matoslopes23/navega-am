import { Inject, Injectable } from '@nestjs/common';
import type { TripsRepository } from '@modules/trips/application/ports/trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';

@Injectable()
export class ListTripLocationsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY)
    private readonly tripsRepository: TripsRepository,
  ) {}

  execute() {
    return this.tripsRepository.listLocations();
  }
}
