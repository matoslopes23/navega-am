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
        accepted: true,
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
          trackingLive: true,
        },
      }),
      this.prisma.tripTimelineEvent.create({
        data: {
          tripId: data.tripId,
          type: 'POSITION_UPDATED',
          title: 'Posição atualizada',
          metadata: {
            latitude: data.latitude,
            longitude: data.longitude,
            confidenceLevel: data.confidenceLevel,
            contributorCount: data.contributorCount,
          },
          occurredAt: data.calculatedAt,
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
        route: { select: { distanceKm: true } },
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
      routeDistanceKm: trip.route?.distanceKm ?? null,
      lastLocation: trip.boatLocations[0] ?? null,
    };
  }

  async recordNearbyPortApproach(
    tripId: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { origin: true, destination: true },
    });
    if (!trip) return;
    const ports = await this.prisma.port.findMany({
      where: {
        OR: [
          { name: { contains: trip.origin, mode: 'insensitive' } },
          { name: { contains: trip.destination, mode: 'insensitive' } },
          { city: { equals: trip.origin, mode: 'insensitive' } },
          { city: { equals: trip.destination, mode: 'insensitive' } },
        ],
      },
    });
    const radians = (value: number) => (value * Math.PI) / 180;
    const nearby = ports.find((port) => {
      const deltaLat = radians(port.latitude - latitude);
      const deltaLng = radians(port.longitude - longitude);
      const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(radians(latitude)) *
          Math.cos(radians(port.latitude)) *
          Math.sin(deltaLng / 2) ** 2;
      const meters = 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return meters <= port.radiusMeters;
    });
    if (!nearby) return;
    const recent = await this.prisma.tripTimelineEvent.findFirst({
      where: {
        tripId,
        type: 'PORT_APPROACH',
        occurredAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
      },
    });
    if (!recent) {
      await this.prisma.tripTimelineEvent.create({
        data: {
          tripId,
          type: 'PORT_APPROACH',
          title: `Embarcação próxima de ${nearby.name}`,
          metadata: { portId: nearby.id, portName: nearby.name },
        },
      });
    }
  }
}
