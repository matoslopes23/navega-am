import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/prisma/prisma.service'; // Ajuste o path conforme seu projeto
import { TrackingQueryRepositoryPort, LastKnownLocation } from '../../application/ports/tracking-query-repository.port';

@Injectable()
export class PrismaTrackingQueryRepository implements TrackingQueryRepositoryPort {
    constructor(private readonly prisma: PrismaService) { }

    async getLastKnownLocation(tripId: string): Promise<LastKnownLocation | null> {
        const trip = await this.prisma.trip.findUnique({
            where: { id: tripId },
            select: {
                latitude: true,
                longitude: true,
                confidenceLevel: true,
                updatedAt: true, // Usamos a data de atualização da viagem como referência
            },
        });

        // Se a viagem não existir ou se o barco ainda não tiver enviado nenhuma coordenada
        if (!trip || trip.latitude === null || trip.longitude === null) {
            return null;
        }

        return {
            latitude: trip.latitude,
            longitude: trip.longitude,
            confidenceLevel: trip.confidenceLevel,
            calculatedAt: trip.updatedAt,
        };
    }
}