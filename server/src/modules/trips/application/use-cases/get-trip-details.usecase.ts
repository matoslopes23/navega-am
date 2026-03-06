import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TripDetails } from '@modules/trips/domain/trip-details';
import type { TripsRepository } from '@modules/trips/application/ports/trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';

@Injectable()
export class GetTripDetailsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY)
    private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(id: string): Promise<TripDetails> {
    const details = await this.tripsRepository.findDetailsById(id);

    if (!details) {
      throw new NotFoundException('Viagem não encontrada.');
    }

    return details;
  }
}
