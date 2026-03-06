import { Injectable } from '@nestjs/common';

import { PrismaService } from '@shared/prisma/prisma.service';
import {
  TripsRepository,
  TripsSearchFilters,
} from '@modules/trips/application/ports/trips.repository';
import { Trip } from '@modules/trips/domain/trip';

@Injectable()
export class PrismaTripsRepository implements TripsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async search(filters: TripsSearchFilters): Promise<Trip[]> {
    const where: Record<string, unknown> = {
      origin: filters.origin,
      destination: filters.destination,
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
}
