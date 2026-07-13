import type { PrismaService } from '@shared/prisma/prisma.service';
import { TrackingMaintenanceService } from './tracking-maintenance.service';

describe('TrackingMaintenanceService', () => {
  const prisma = {
    trackingParticipant: { updateMany: jest.fn() },
    trip: { findMany: jest.fn(), count: jest.fn() },
    rawLocation: { deleteMany: jest.fn(), count: jest.fn() },
    trackingParticipantCount: jest.fn(),
    tripReport: { count: jest.fn() },
    $transaction: jest.fn(),
  };
  const service = new TrackingMaintenanceService(
    prisma as unknown as PrismaService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.trackingParticipant.updateMany.mockResolvedValue({ count: 0 });
    prisma.trip.findMany.mockResolvedValue([]);
    prisma.rawLocation.deleteMany.mockResolvedValue({ count: 0 });
  });

  it('expires participants and removes raw locations past retention', async () => {
    await service.run();

    expect(prisma.trackingParticipant.updateMany).toHaveBeenCalled();
    expect(prisma.rawLocation.deleteMany).toHaveBeenCalled();
  });
});
