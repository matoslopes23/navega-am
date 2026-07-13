/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException } from '@nestjs/common';
import type { TripsRepository } from '../ports/trips.repository';
import { UpdateTripStatusUseCase } from './update-trip-status.usecase';

describe('UpdateTripStatusUseCase', () => {
  const repository = {
    findDetailsById: jest.fn(),
    updateStatus: jest.fn(),
  } as unknown as jest.Mocked<TripsRepository>;
  const useCase = new UpdateTripStatusUseCase(repository);

  beforeEach(() => jest.clearAllMocks());

  it('allows a trip to enter transit from port', async () => {
    repository.findDetailsById.mockResolvedValue({
      status: 'no-porto',
    } as never);
    repository.updateStatus.mockResolvedValue({
      status: 'em-transito',
    } as never);

    await useCase.execute('trip-1', 'em-transito');

    expect(repository.updateStatus).toHaveBeenCalledWith(
      'trip-1',
      'em-transito',
    );
  });

  it('rejects transitions from a completed trip', async () => {
    repository.findDetailsById.mockResolvedValue({
      status: 'concluido',
    } as never);

    await expect(
      useCase.execute('trip-1', 'em-transito'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
