import type { TripsRepository } from '../ports/trips.repository';
import { GetTripHistoryUseCase } from './get-trip-history.usecase';

describe('GetTripHistoryUseCase', () => {
  const getLocationHistory = jest.fn();
  const getTimeline = jest.fn();
  const repository = {
    getLocationHistory,
    getTimeline,
  } as unknown as jest.Mocked<TripsRepository>;
  const useCase = new GetTripHistoryUseCase(repository);

  beforeEach(() => jest.clearAllMocks());

  it('delega histórico paginado ao repositório', async () => {
    repository.getLocationHistory.mockResolvedValue([]);
    await useCase.locations('trip-1', 2);
    expect(getLocationHistory).toHaveBeenCalledWith('trip-1', 2);
  });

  it('delega timeline ao repositório', async () => {
    repository.getTimeline.mockResolvedValue([]);
    await useCase.timeline('trip-1');
    expect(getTimeline).toHaveBeenCalledWith('trip-1');
  });
});
