import { Injectable } from '@nestjs/common';

import { PrismaService } from '@shared/prisma/prisma.service';
import { UserRepository } from '@modules/users/application/ports/user.repository';
import { UserManagementRepository } from '@modules/users/application/ports/user-management.repository';
import { User } from '@modules/users/domain/user';

@Injectable()
export class PrismaUserRepository
  implements UserRepository, UserManagementRepository
{
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByCpf(cpf: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { cpf } });
  }

  findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: {
    name: string;
    email: string;
    phone?: string | null;
    cpf: string;
    passwordHash: string;
  }): Promise<User> {
    return this.prisma.user.create({ data });
  }

  getProfile(id: string): Promise<unknown> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        locationConsentAt: true,
        locationConsentRevokedAt: true,
        createdAt: true,
      },
    });
  }

  updateProfile(
    id: string,
    data: { name?: string; phone?: string },
  ): Promise<unknown> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
  }

  updateLocationConsent(
    id: string,
    consent: boolean,
    at: Date,
  ): Promise<unknown> {
    return this.prisma.user.update({
      where: { id },
      data: consent
        ? { locationConsentAt: at, locationConsentRevokedAt: null }
        : { locationConsentRevokedAt: at },
      select: { locationConsentAt: true, locationConsentRevokedAt: true },
    });
  }

  exportData(id: string): Promise<unknown> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        trackingParticipations: true,
        tripReports: true,
        notificationSubscriptions: true,
        notifications: true,
      },
    });
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  list(page: number): Promise<unknown[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * 50,
      take: 50,
    });
  }

  changeRole(
    id: string,
    role: 'USER' | 'ADMIN',
    actorId: string,
  ): Promise<unknown> {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
      });
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: 'USER_ROLE_CHANGED',
          entity: 'User',
          entityId: id,
          metadata: { role },
        },
      });
      return user;
    });
  }

  listAuditLogs(): Promise<unknown[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.deleteMany({ where: { userId } }),
      this.prisma.passwordResetToken.create({
        data: { userId, tokenHash, expiresAt },
      }),
    ]);
  }

  async resetPasswordWithToken(
    tokenHash: string,
    passwordHash: string,
    now: Date,
  ): Promise<boolean> {
    return this.prisma.$transaction(async (tx) => {
      const token = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
      });
      if (!token || token.usedAt || token.expiresAt <= now) return false;

      const consumed = await tx.passwordResetToken.updateMany({
        where: { id: token.id, usedAt: null, expiresAt: { gt: now } },
        data: { usedAt: now },
      });
      if (consumed.count !== 1) return false;

      await tx.user.update({
        where: { id: token.userId },
        data: { passwordHash },
      });
      await tx.passwordResetToken.deleteMany({
        where: { userId: token.userId, id: { not: token.id } },
      });
      return true;
    });
  }
}
