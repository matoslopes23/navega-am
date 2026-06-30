import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service'; // Ajuste o path
import {
    TrackingRepositoryPort,
    RawLocationInput,
    RecentLocation,
    SaveBoatLocationInput
} from '../../application/ports/tracking-repository.port';

@Injectable()
export class PrismaTrackingRepository implements TrackingRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async saveRawLocations(data: RawLocationInput[]): Promise<void> {
        await this.prisma.rawLocation.createMany({ data });
    }

    async getRecentUniqueLocations(tripId: string, since: Date): Promise<RecentLocation[]> {
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
        });
    }

    async saveBoatLocationAndUpdateTrip(data: SaveBoatLocationInput): Promise<void> {
        // Executa em uma transação ACID para garantir consistência total
        await this.prisma.$transaction([
            this.prisma.boatLocation.create({
                data: {
                    tripId: data.tripId,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    confidenceLevel: data.confidenceLevel,
                    calculatedAt: data.calculatedAt,
                },
            }),
            this.prisma.trip.update({
                where: { id: data.tripId },
                data: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    confidenceLevel: data.confidenceLevel,
                },
            }),
        ]);
    }
}