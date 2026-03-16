import { Inject, Injectable } from '@nestjs/common';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';
import type { TripsRepository } from '@modules/trips/application/ports/trips.repository';
import { TripDetails } from '@modules/trips/domain/trip-details';

export type CreateTripInput = {
  boatName: string;
  boatType: string;
  price: number;
  origin: string;
  destination: string;
  departureDate: string;
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

@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY)
    private readonly tripsRepository: TripsRepository,
  ) {}

  async execute(input: CreateTripInput): Promise<TripDetails> {
    const departureDate = new Date(`${input.departureDate}T00:00:00.000Z`);

    return await this.tripsRepository.create({
      boatName: input.boatName.trim(),
      boatType: input.boatType.trim(),
      price: input.price,
      origin: input.origin.trim(),
      destination: input.destination.trim(),
      departureDate,
      departureTime: input.departureTime,
      status: input.status,
      latitude: input.latitude,
      longitude: input.longitude,
      itinerary: input.itinerary,
      accommodations: input.accommodations,
    });
  }
}
