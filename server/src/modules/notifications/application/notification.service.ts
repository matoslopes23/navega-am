import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@shared/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  registerDevice(userId: string, token: string, platform: string) {
    return this.prisma.notificationDevice.upsert({
      where: { token },
      create: { userId, token, platform },
      update: { userId, platform, active: true },
    });
  }

  async subscribe(userId: string, tripId: string) {
    if (
      !(await this.prisma.trip.findUnique({
        where: { id: tripId },
        select: { id: true },
      }))
    ) {
      throw new NotFoundException('Viagem não encontrada.');
    }
    return this.prisma.tripNotificationSubscription.upsert({
      where: { tripId_userId: { tripId, userId } },
      create: { tripId, userId },
      update: { active: true },
    });
  }

  unsubscribe(userId: string, tripId: string) {
    return this.prisma.tripNotificationSubscription.updateMany({
      where: { tripId, userId },
      data: { active: false },
    });
  }

  subscriptions(userId: string) {
    return this.prisma.tripNotificationSubscription.findMany({
      where: { userId, active: true },
      include: {
        trip: {
          select: {
            id: true,
            boatName: true,
            origin: true,
            destination: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  list(userId: string, page = 1, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  markRead(userId: string, id: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async notifyTrip(tripId: string, type: string, title: string, body: string) {
    const subscriptions =
      await this.prisma.tripNotificationSubscription.findMany({
        where: { tripId, active: true },
        select: { userId: true },
      });
    if (!subscriptions.length) return;
    await this.prisma.notification.createMany({
      data: subscriptions.map(({ userId }) => ({
        userId,
        tripId,
        type,
        title,
        body,
      })),
    });
  }
}
