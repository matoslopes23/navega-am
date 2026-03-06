import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { TripsRepository } from '@modules/trips/application/ports/trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';
import { TripDetails } from '@modules/trips/domain/trip-details';

export type UpdateTripContributionInput = {
  id: string;
  userDepartureDate?: string;
  userDepartureTime?: string;
};

@Injectable()
export class UpdateTripContributionUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY)
    private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(input: UpdateTripContributionInput): Promise<TripDetails> {
    const userDepartureDate = input.userDepartureDate
      ? new Date(`${input.userDepartureDate}T00:00:00.000Z`)
      : undefined;

    const updated = await this.tripsRepository.updateContribution(input.id, {
      userDepartureDate,
      userDepartureTime: input.userDepartureTime,
    });

    if (!updated) {
      throw new NotFoundException('Viagem não encontrada.');
    }

    return updated;
  }
}
