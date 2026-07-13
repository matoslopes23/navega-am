import { SaveBoatLocationInput } from './tracking-repository.port';

export interface RealTimeEmitterPort {
  emitLocationUpdate(tripId: string, locationData: SaveBoatLocationInput): void;
}
