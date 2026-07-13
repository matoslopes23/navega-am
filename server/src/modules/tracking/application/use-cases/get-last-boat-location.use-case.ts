import { Injectable, Inject } from '@nestjs/common';
import { TrackingTokens } from '../../tracking.tokens';
import type { TrackingQueryRepositoryPort } from '../ports/tracking-query-repository.port';

@Injectable()
export class GetLastBoatLocationUseCase {
  constructor(
    @Inject(TrackingTokens.TRACKING_QUERY_REPOSITORY_PORT)
    private readonly queryRepository: TrackingQueryRepositoryPort,
  ) {}

  async execute(tripId: string) {
    const location = await this.queryRepository.getLastKnownLocation(tripId);

    if (!location) {
      return null;
    }

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      confidenceLevel: location.confidenceLevel,
      // Retornamos como string ISO para facilitar a leitura no frontend (React Native)
      calculatedAt: location.calculatedAt.toISOString(),
    };
  }
}
