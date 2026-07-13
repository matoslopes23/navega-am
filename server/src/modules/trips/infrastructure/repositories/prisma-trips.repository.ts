import { Injectable } from '@nestjs/common';
import { Prisma, TripStatus } from '@prisma/client';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  TripsRepository,
  CreateTripInput,
  TripsSearchFilters,
} from '@modules/trips/application/ports/trips.repository';
import { Trip } from '@modules/trips/domain/trip';
import { TripDetails } from '@modules/trips/domain/trip-details';
import { ActiveTrip } from '@modules/trips/domain/active-trip';

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
        boatLocations: {
          orderBy: { calculatedAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!trip) return null;

    const status = trip.status.replaceAll('_', '-') as TripDetails['status'];
    const statusLabelMap: Record<TripDetails['status'], string> = {
      'em-transito': 'EM TRÂNSITO',
      'no-porto': 'NO PORTO',
      programado: 'PROGRAMADO',
      embarcando: 'EMBARCANDO',
      concluido: 'CONCLUÍDO',
      cancelado: 'CANCELADO',
      atrasado: 'ATRASADO',
    };
    const statusLabel = statusLabelMap[status];

    const latestLocation = trip.boatLocations[0];
    const live = latestLocation
      ? Date.now() - latestLocation.calculatedAt.getTime() <= 2 * 60 * 1000
      : false;
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
        type: item.type,
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
      tracking: {
        available: Boolean(latestLocation),
        live,
        lastPositionAt: latestLocation?.calculatedAt.toISOString() ?? null,
        contributorCount: latestLocation?.contributorCount ?? 0,
        confidenceLevel: latestLocation?.confidenceLevel ?? 'BAIXO',
        speedKmh: latestLocation?.speedKmh ?? null,
        progressPercent: latestLocation?.progressPercent ?? null,
        remainingDistanceKm: latestLocation?.remainingDistanceKm ?? null,
        estimatedArrival:
          latestLocation?.estimatedArrival?.toISOString() ?? null,
      },
    };
  }

  async create(input: CreateTripInput): Promise<TripDetails> {
    const createData: Prisma.TripCreateInput = {
      boatName: input.boatName,
      boatType: input.boatType,
      price: input.price,
      origin: input.origin,
      destination: input.destination,
      departureDate: input.departureDate,
      departureTime: input.departureTime,
      latitude: input.latitude,
      longitude: input.longitude,
      originLatitude: input.originLatitude,
      originLongitude: input.originLongitude,
      destinationLatitude: input.destinationLatitude,
      destinationLongitude: input.destinationLongitude,
      ...(input.status
        ? {
            status: input.status.replaceAll('-', '_') as TripStatus,
          }
        : {}),
      ...(input.itinerary?.length
        ? {
            itineraries: {
              create: input.itinerary.map((item, index) => ({
                name: item.name,
                type: item.type,
                time: item.time,
                description: item.description,
                status: item.status,
                order: item.order ?? index + 1,
              })),
            },
          }
        : {}),
      ...(input.accommodations?.length
        ? {
            accommodations: {
              create: input.accommodations.map((item) => ({
                name: item.name,
                price: item.price,
                description: item.description,
              })),
            },
          }
        : {}),
    };

    const trip = await this.prisma.trip.create({
      data: createData,
    });

    const details = await this.findDetailsById(trip.id);

    if (!details) {
      throw new Error('Viagem recém criada não encontrada.');
    }

    return details;
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

  async listActive(filters?: {
    origin?: string;
    destination?: string;
  }): Promise<ActiveTrip[]> {
    const trips = await this.prisma.trip.findMany({
      where: {
        status: 'em_transito',
        ...(filters?.origin
          ? { origin: { equals: filters.origin, mode: 'insensitive' } }
          : {}),
        ...(filters?.destination
          ? {
              destination: {
                equals: filters.destination,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { departureDate: 'asc' },
      include: {
        boatLocations: { orderBy: { calculatedAt: 'desc' }, take: 1 },
      },
    });

    return trips.map((trip) => {
      const location = trip.boatLocations[0];
      return {
        id: trip.id,
        boatName: trip.boatName,
        boatType: trip.boatType,
        origin: trip.origin,
        destination: trip.destination,
        departureTime: trip.departureTime,
        price: `R$ ${trip.price}`,
        status: 'em-transito' as const,
        live: Boolean(
          location && Date.now() - location.calculatedAt.getTime() <= 120_000,
        ),
        position: location
          ? {
              latitude: location.latitude,
              longitude: location.longitude,
              calculatedAt: location.calculatedAt.toISOString(),
            }
          : null,
        confidenceLevel: location?.confidenceLevel ?? 'BAIXO',
        contributorCount: location?.contributorCount ?? 0,
        speedKmh: location?.speedKmh ?? null,
        progressPercent: location?.progressPercent ?? null,
        remainingDistanceKm: location?.remainingDistanceKm ?? null,
        estimatedArrival: location?.estimatedArrival?.toISOString() ?? null,
      };
    });
  }

  async updateStatus(id: string, status: string): Promise<TripDetails | null> {
    const existing = await this.prisma.trip.findUnique({ where: { id } });
    if (!existing) return null;
    await this.prisma.trip.update({
      where: { id },
      data: { status: status.replaceAll('-', '_') as TripStatus },
    });
    return this.findDetailsById(id);
  }
}
