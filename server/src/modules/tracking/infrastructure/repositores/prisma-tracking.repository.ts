import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service'; // Ajuste o path
import {
  TrackingRepositoryPort,
  RawLocationInput,
  RecentLocation,
  SaveBoatLocationInput,
} from '../../application/ports/tracking-repository.port';

@Injectable()
export class PrismaTrackingRepository implements TrackingRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async saveRawLocations(data: RawLocationInput[]): Promise<void> {
    await this.prisma.rawLocation.createMany({ data, skipDuplicates: true });
  }

  async getRecentUniqueLocations(
    tripId: string,
    since: Date,
  ): Promise<RecentLocation[]> {
    return this.prisma.rawLocation.findMany({
      where: {
        tripId,
        pingedAt: { gte: since },
      },
      distinct: ['deviceId'],
      select: {
        latitude: true,
        longitude: true,
      },
      orderBy: { pingedAt: 'desc' },
    });
  }

  async saveBoatLocationAndUpdateTrip(
    data: SaveBoatLocationInput,
  ): Promise<void> {
    // Executa em uma transação ACID para garantir consistência total
    await this.prisma.$transaction([
      this.prisma.boatLocation.create({
        data: {
          tripId: data.tripId,
          latitude: data.latitude,
          longitude: data.longitude,
          confidenceLevel: data.confidenceLevel,
          calculatedAt: data.calculatedAt,
          contributorCount: data.contributorCount,
          speedKmh: data.speedKmh,
          progressPercent: data.progressPercent,
          remainingDistanceKm: data.remainingDistanceKm,
          estimatedArrival: data.estimatedArrival,
        },
      }),
      this.prisma.trip.updateMany({
        where: {
          id: data.tripId,
          status: {
            in: [
              'programado',
              'no_porto',
              'embarcando',
              'atrasado',
              'em_transito',
            ],
          },
        },
        data: {
          latitude: data.latitude,
          longitude: data.longitude,
          confidenceLevel: data.confidenceLevel,
          lastPositionAt: data.calculatedAt,
          status: 'em_transito',
        },
      }),
    ]);
  }

  async getTripTrackingContext(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        originLatitude: true,
        originLongitude: true,
        destinationLatitude: true,
        destinationLongitude: true,
        boatLocations: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
          select: { latitude: true, longitude: true, calculatedAt: true },
        },
      },
    });
    if (!trip) return null;
    return {
      originLatitude: trip.originLatitude,
      originLongitude: trip.originLongitude,
      destinationLatitude: trip.destinationLatitude,
      destinationLongitude: trip.destinationLongitude,
      lastLocation: trip.boatLocations[0] ?? null,
    };
  }
}
