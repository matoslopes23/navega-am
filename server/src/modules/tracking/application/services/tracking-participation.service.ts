import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class TrackingParticipationService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureActiveTrip(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: { status: true },
    });
    if (!trip) throw new NotFoundException('Viagem não encontrada.');
    if (trip.status !== 'em_transito') {
      throw new BadRequestException(
        'O compartilhamento só pode ser iniciado em viagens em trânsito.',
      );
    }
  }

  async start(tripId: string, userId: string) {
    await this.ensureActiveTrip(tripId);
    const now = new Date();
    await this.prisma.trackingParticipant.upsert({
      where: { tripId_userId: { tripId, userId } },
      create: { tripId, userId, active: true, startedAt: now, lastSeenAt: now },
      update: {
        active: true,
        startedAt: now,
        lastSeenAt: now,
        stoppedAt: null,
      },
    });
    return this.status(tripId, userId);
  }

  async heartbeat(tripId: string, userId: string) {
    const updated = await this.prisma.trackingParticipant.updateMany({
      where: { tripId, userId, active: true },
      data: { lastSeenAt: new Date() },
    });
    if (!updated.count) {
      throw new BadRequestException('O compartilhamento não está ativo.');
    }
    return this.status(tripId, userId);
  }

  async stop(tripId: string, userId: string) {
    await this.prisma.trackingParticipant.updateMany({
      where: { tripId, userId },
      data: { active: false, stoppedAt: new Date() },
    });
    return this.status(tripId, userId);
  }

  async status(tripId: string, userId?: string) {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000);
    await this.prisma.trackingParticipant.updateMany({
      where: { tripId, active: true, lastSeenAt: { lt: cutoff } },
      data: { active: false, stoppedAt: new Date() },
    });
    const [contributors, participant, location] = await Promise.all([
      this.prisma.trackingParticipant.count({
        where: { tripId, active: true, lastSeenAt: { gte: cutoff } },
      }),
      userId
        ? this.prisma.trackingParticipant.findUnique({
            where: { tripId_userId: { tripId, userId } },
          })
        : null,
      this.prisma.boatLocation.findFirst({
        where: { tripId },
        orderBy: { calculatedAt: 'desc' },
      }),
    ]);
    return {
      live: Boolean(
        location && Date.now() - location.calculatedAt.getTime() <= 120_000,
      ),
      contributors,
      confidenceLevel: location?.confidenceLevel ?? 'BAIXO',
      lastPositionAt: location?.calculatedAt.toISOString() ?? null,
      sharing: Boolean(participant?.active && participant.lastSeenAt >= cutoff),
    };
  }
}
