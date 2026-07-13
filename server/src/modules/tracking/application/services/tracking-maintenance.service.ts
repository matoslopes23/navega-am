import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class TrackingMaintenanceService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(TrackingMaintenanceService.name);
  private timer?: NodeJS.Timeout;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.timer = setInterval(() => void this.run(), 60_000);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  async run() {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000);
    const retentionCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    try {
      await this.prisma.trackingParticipant.updateMany({
        where: { active: true, lastSeenAt: { lt: cutoff } },
        data: { active: false, stoppedAt: new Date() },
      });
      const staleTrips = await this.prisma.trip.findMany({
        where: { trackingLive: true, lastPositionAt: { lt: cutoff } },
        select: { id: true },
      });
      if (staleTrips.length) {
        await this.prisma.$transaction([
          this.prisma.trip.updateMany({
            where: { id: { in: staleTrips.map(({ id }) => id) } },
            data: { trackingLive: false, confidenceLevel: 'BAIXO' },
          }),
          this.prisma.tripTimelineEvent.createMany({
            data: staleTrips.map(({ id }) => ({
              tripId: id,
              type: 'TRACKING_STOPPED',
              title: 'Acompanhamento em tempo real encerrado',
            })),
          }),
        ]);
      }
      await this.prisma.rawLocation.deleteMany({
        where: { createdAt: { lt: retentionCutoff } },
      });
    } catch (error) {
      this.logger.error(
        'Falha na manutenção do tracking.',
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async metrics() {
    const cutoff = new Date(Date.now() - 2 * 60 * 1000);
    const [liveTrips, activeContributors, pendingReports, rejectedPoints] =
      await Promise.all([
        this.prisma.trip.count({ where: { trackingLive: true } }),
        this.prisma.trackingParticipant.count({
          where: { active: true, lastSeenAt: { gte: cutoff } },
        }),
        this.prisma.tripReport.count({ where: { status: 'PENDING' } }),
        this.prisma.rawLocation.count({
          where: {
            accepted: false,
            createdAt: { gte: new Date(Date.now() - 3600000) },
          },
        }),
      ]);
    return {
      liveTrips,
      activeContributors,
      pendingReports,
      rejectedPointsLastHour: rejectedPoints,
    };
  }
}
