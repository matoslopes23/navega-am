import { Injectable } from '@nestjs/common';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  TripsRepository,
  TripsSearchFilters,
} from '@modules/trips/application/ports/trips.repository';
import { Trip } from '@modules/trips/domain/trip';
import { TripDetails } from '@modules/trips/domain/trip-details';

@Injectable()
export class PrismaTripsRepository implements TripsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(filters: TripsSearchFilters): Promise<Trip[]> {
    const where: Record<string, unknown> = {
      origin: {
        equals: filters.origin,
        mode: 'insensitive',
      },
      destination: {
        equals: filters.destination,
        mode: 'insensitive',
      },
    };

    if (filters.dateRange) {
      where.departureDate = {
        gte: filters.dateRange.start,
        lte: filters.dateRange.end,
      };
    }

    if (filters.timeRange?.from || filters.timeRange?.to) {
      where.departureTime = {
        ...(filters.timeRange.from ? { gte: filters.timeRange.from } : {}),
        ...(filters.timeRange.to ? { lte: filters.timeRange.to } : {}),
      };
    }

    const trips = await this.prisma.trip.findMany({
      where,
      orderBy: { departureTime: 'asc' },
      skip: filters.pagination.skip,
      take: filters.pagination.take,
    });

    return trips.map((trip) => ({
      id: trip.id,
      boatName: trip.boatName,
      boatType: trip.boatType,
      price: `R$ ${trip.price}`,
      departureTime: trip.departureTime,
      origin: trip.origin,
      destination: trip.destination,
    }));
  }

  async findDetailsById(id: string): Promise<TripDetails | null> {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        itineraries: {
          orderBy: { order: 'asc' },
        },
        accommodations: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!trip) return null;

    const status = trip.status.replaceAll('_', '-') as TripDetails['status'];
    const statusLabelMap: Record<TripDetails['status'], string> = {
      'em-transito': 'EM TRÂNSITO',
      'no-porto': 'NO PORTO',
      programado: 'PROGRAMADO',
    };
    const statusLabel = statusLabelMap[status];

    return {
      id: trip.id,
      name: trip.boatName,
      status,
      statusLabel,
      userDepartureDate: trip.userDepartureDate
        ? trip.userDepartureDate.toISOString().split('T')[0]
        : undefined,
      userDepartureTime: trip.userDepartureTime ?? undefined,
      currentPosition: {
        latitude: trip.latitude,
        longitude: trip.longitude,
      },
      itinerary: trip.itineraries.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type as TripDetails['itinerary'][number]['type'],
        time: item.time,
        description: item.description,
        status: item.status ?? undefined,
      })),
      accommodationsStatus:
        trip.accommodations.length > 0 ? 'disponivel' : 'esgotado',
      accommodations: trip.accommodations.map((item) => ({
        id: item.id,
        name: item.name,
        price: `R$ ${item.price}`,
        description: item.description ?? undefined,
      })),
      notificationsEnabled: false,
    };
  }

  async updateContribution(
    id: string,
    data: {
      userDepartureDate?: Date;
      userDepartureTime?: string;
    },
  ): Promise<TripDetails | null> {
    const existing = await this.prisma.trip.findUnique({ where: { id } });
    if (!existing) return null;

    const updated = await this.prisma.trip.update({
      where: { id },
      data: {
        userDepartureDate: data.userDepartureDate,
        userDepartureTime: data.userDepartureTime,
      },
      include: {
        itineraries: {
          orderBy: { order: 'asc' },
        },
        accommodations: {
          orderBy: { price: 'asc' },
        },
      },
    });

    return this.findDetailsById(updated.id);
  }

  async listLocations(): Promise<{
    origins: string[];
    destinations: string[];
  }> {
    const origins = await this.prisma.trip.findMany({
      select: { origin: true },
      distinct: ['origin'],
      orderBy: { origin: 'asc' },
    });
    const destinations = await this.prisma.trip.findMany({
      select: { destination: true },
      distinct: ['destination'],
      orderBy: { destination: 'asc' },
    });

    return {
      origins: origins.map((item) => item.origin),
      destinations: destinations.map((item) => item.destination),
    };
  }
}
