import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service'; // Ajuste o path conforme seu projeto
import {
  TrackingQueryRepositoryPort,
  LastKnownLocation,
} from '../../application/ports/tracking-query-repository.port';

@Injectable()
export class PrismaTrackingQueryRepository implements TrackingQueryRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getLastKnownLocation(
    tripId: string,
  ): Promise<LastKnownLocation | null> {
    const location = await this.prisma.boatLocation.findFirst({
      where: { tripId },
      orderBy: { calculatedAt: 'desc' },
      select: {
        latitude: true,
        longitude: true,
        confidenceLevel: true,
        calculatedAt: true,
        contributorCount: true,
        speedKmh: true,
        progressPercent: true,
        remainingDistanceKm: true,
        estimatedArrival: true,
      },
    });

    // Se a viagem não existir ou se o barco ainda não tiver enviado nenhuma coordenada
    if (!location) {
      return null;
    }

    return {
      ...location,
    };
  }
}
