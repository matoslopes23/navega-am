import { Module } from '@nestjs/common';

import { TripsController } from '@modules/trips/presentation/trips.controller';
import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';
import { UpdateTripContributionUseCase } from '@modules/trips/application/use-cases/update-trip-contribution.usecase';
import { ListTripLocationsUseCase } from '@modules/trips/application/use-cases/list-trip-locations.usecase';
import { CreateTripUseCase } from '@modules/trips/application/use-cases/create-trip.usecase';
import { PrismaTripsRepository } from '@modules/trips/infrastructure/repositories/prisma-trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';

@Module({
  controllers: [TripsController],
  providers: [
    SearchTripsUseCase,
    GetTripDetailsUseCase,
    UpdateTripContributionUseCase,
    ListTripLocationsUseCase,
    CreateTripUseCase,
    {
      provide: TRIPS_REPOSITORY,
      useClass: PrismaTripsRepository,
    },
  ],
})
export class TripsModule {}
