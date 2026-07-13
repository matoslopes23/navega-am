import { Inject, Injectable } from '@nestjs/common';
import type {
  CreatePortInput,
  CreateRiverRouteInput,
  TripsRepository,
} from '../ports/trips.repository';
import { TRIPS_REPOSITORY } from '../../trips.tokens';

@Injectable()
export class ManageTripOperationsUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly trips: TripsRepository,
  ) {}
  listPorts() {
    return this.trips.listPorts();
  }
  createPort(input: CreatePortInput) {
    return this.trips.createPort(input);
  }
  listRoutes() {
    return this.trips.listRiverRoutes();
  }
  createRoute(input: CreateRiverRouteInput) {
    return this.trips.createRiverRoute(input);
  }
  assignRoute(tripId: string, routeId: string) {
    return this.trips.assignRoute(tripId, routeId);
  }
}
