import { Inject, Injectable } from '@nestjs/common';
import type { TripsRepository } from '../ports/trips.repository';
import { TRIPS_REPOSITORY } from '../../trips.tokens';

@Injectable()
export class ListActiveTripsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly repository: TripsRepository,
  ) {}

  execute(origin?: string, destination?: string) {
    return this.repository.listActive({
      origin: origin?.trim() || undefined,
      destination: destination?.trim() || undefined,
    });
  }
}
