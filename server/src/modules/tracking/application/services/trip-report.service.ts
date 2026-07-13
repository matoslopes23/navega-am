import { Injectable, NotFoundException } from '@nestjs/common';
import type { TripReportStatus, TripReportType } from '@prisma/client';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class TripReportService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureTrip(tripId: string) {
    if (
      !(await this.prisma.trip.findUnique({
        where: { id: tripId },
        select: { id: true },
      }))
    ) {
      throw new NotFoundException('Viagem não encontrada.');
    }
  }

  async create(
    tripId: string,
    userId: string,
    input: {
      type: TripReportType;
      description?: string;
      latitude?: number;
      longitude?: number;
    },
  ) {
    await this.ensureTrip(tripId);
    return this.prisma.tripReport.create({
      data: { tripId, userId, ...input },
      select: {
        id: true,
        type: true,
        description: true,
        latitude: true,
        longitude: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async summary(tripId: string) {
    await this.ensureTrip(tripId);
    const reports = await this.prisma.tripReport.groupBy({
      by: ['type'],
      where: {
        tripId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        createdAt: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      },
      _count: { _all: true },
      _max: { createdAt: true },
    });
    return reports.map((report) => ({
      type: report.type,
      count: report._count._all,
      lastReportedAt: report._max.createdAt?.toISOString() ?? null,
    }));
  }

  async moderate(tripId: string, reportId: string, status: TripReportStatus) {
    const report = await this.prisma.tripReport.findFirst({
      where: { id: reportId, tripId },
    });
    if (!report) throw new NotFoundException('Relato não encontrado.');
    const updated = await this.prisma.tripReport.update({
      where: { id: reportId },
      data: { status },
    });
    if (
      status === 'CONFIRMED' &&
      report.type === 'MANUAL_POSITION' &&
      report.latitude != null &&
      report.longitude != null
    ) {
      await this.prisma.$transaction([
        this.prisma.boatLocation.create({
          data: {
            tripId,
            latitude: report.latitude,
            longitude: report.longitude,
            confidenceLevel: 'BAIXO',
            contributorCount: 1,
            calculatedAt: report.createdAt,
          },
        }),
        this.prisma.trip.update({
          where: { id: tripId },
          data: {
            latitude: report.latitude,
            longitude: report.longitude,
            confidenceLevel: 'BAIXO',
            lastPositionAt: report.createdAt,
          },
        }),
      ]);
    }
    return updated;
  }
}
