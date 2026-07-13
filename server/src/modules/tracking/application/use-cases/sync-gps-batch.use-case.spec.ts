/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException } from '@nestjs/common';
import type { TrackingQueuePort } from '../ports/tracking-queue.port';
import { SyncGpsBatchUseCase } from './sync-gps-batch.use-case';

describe('SyncGpsBatchUseCase', () => {
  const queue: jest.Mocked<TrackingQueuePort> = {
    addBatchProcessJob: jest.fn(),
  };
  const useCase = new SyncGpsBatchUseCase(queue);

  beforeEach(() => jest.clearAllMocks());

  it('queues a valid GPS batch', async () => {
    const dto = {
      tripId: '123e4567-e89b-42d3-a456-426614174000',
      deviceId: 'authenticated-user-id',
      locations: [
        { latitude: -3.1, longitude: -60, pingedAt: new Date().toISOString() },
      ],
    };

    await useCase.execute(dto);

    expect(queue.addBatchProcessJob).toHaveBeenCalledWith(dto);
  });

  it('rejects timestamps outside the accepted offline window', async () => {
    const dto = {
      tripId: '123e4567-e89b-42d3-a456-426614174000',
      deviceId: 'authenticated-user-id',
      locations: [
        {
          latitude: -3.1,
          longitude: -60,
          pingedAt: new Date(
            Date.now() - 8 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ],
    };

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(queue.addBatchProcessJob).not.toHaveBeenCalled();
  });
});
