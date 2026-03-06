import { Inject, Injectable } from '@nestjs/common';
import { Trip } from '@modules/trips/domain/trip';
import type { TripsRepository } from '@modules/trips/application/ports/trips.repository';
import { TripsSearchFilters } from '@modules/trips/application/ports/trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';

@Injectable()
export class SearchTripsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY)
    private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(
    origin: string,
    destination: string,
    date?: string,
    timeFrom?: string,
    timeTo?: string,
    page = 1,
    limit = 10,
  ): Promise<Trip[]> {
    const originValue = origin.trim();
    const destinationValue = destination.trim();
    const skip = (page - 1) * limit;
    const filters: TripsSearchFilters = {
      origin: originValue,
      destination: destinationValue,
      pagination: {
        skip,
        take: limit,
      },
    };

    if (date) {
      const start = new Date(`${date}T00:00:00.000Z`);
      const end = new Date(`${date}T23:59:59.999Z`);
      filters.dateRange = { start, end };
    }

    if (timeFrom || timeTo) {
      filters.timeRange = {
        ...(timeFrom ? { from: timeFrom } : {}),
        ...(timeTo ? { to: timeTo } : {}),
      };
    }

    return this.tripsRepository.search(filters);
  }
}
