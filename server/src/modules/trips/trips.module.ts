import { Module } from '@nestjs/common';

import { TripsController } from '@modules/trips/presentation/trips.controller';
import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';
import { UpdateTripContributionUseCase } from '@modules/trips/application/use-cases/update-trip-contribution.usecase';
import { ListTripLocationsUseCase } from '@modules/trips/application/use-cases/list-trip-locations.usecase';
import { CreateTripUseCase } from '@modules/trips/application/use-cases/create-trip.usecase';
import { PrismaTripsRepository } from '@modules/trips/infrastructure/repositories/prisma-trips.repository';
import { TRIPS_REPOSITORY } from '@modules/trips/trips.tokens';
import { AuthModule } from '@modules/auth/auth.module';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import { ListActiveTripsUseCase } from './application/use-cases/list-active-trips.usecase';
import { UpdateTripStatusUseCase } from './application/use-cases/update-trip-status.usecase';
import { ManageTripOperationsUseCase } from './application/use-cases/manage-trip-operations.usecase';
import { GetTripHistoryUseCase } from './application/use-cases/get-trip-history.usecase';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import {
  TripHistoryController,
  TripOperationsController,
} from './presentation/trip-operations.controller';

@Module({
  imports: [AuthModule, NotificationsModule],
  controllers: [
    TripsController,
    TripOperationsController,
    TripHistoryController,
  ],
  providers: [
    SearchTripsUseCase,
    GetTripDetailsUseCase,
    UpdateTripContributionUseCase,
    ListTripLocationsUseCase,
    CreateTripUseCase,
    ListActiveTripsUseCase,
    UpdateTripStatusUseCase,
    ManageTripOperationsUseCase,
    GetTripHistoryUseCase,
    RateLimitGuard,
    {
      provide: TRIPS_REPOSITORY,
      useClass: PrismaTripsRepository,
    },
  ],
  exports: [ListActiveTripsUseCase],
})
export class TripsModule {}
