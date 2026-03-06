/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';

import { TripsController } from '@modules/trips/presentation/trips.controller';
import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';

describe('TripsController', () => {
  let controller: TripsController;
  let useCase: jest.Mocked<SearchTripsUseCase>;
  let detailsUseCase: jest.Mocked<GetTripDetailsUseCase>;

  beforeEach(async () => {
    const useCaseMock = {
      execute: jest.fn(),
    };
    const detailsUseCaseMock = {
      execute: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [
        {
          provide: SearchTripsUseCase,
          useValue: useCaseMock,
        },
        {
          provide: GetTripDetailsUseCase,
          useValue: detailsUseCaseMock,
        },
      ],
    }).compile();

    controller = moduleRef.get(TripsController);
    useCase = moduleRef.get(SearchTripsUseCase);
    detailsUseCase = moduleRef.get(GetTripDetailsUseCase);
  });

  it('delegates search with pagination and filters', async () => {
    useCase.execute.mockResolvedValue([]);

    await controller.search({
      origin: 'Manaus',
      destination: 'Parintins',
      date: '2026-03-06',
      timeFrom: '06:00',
      timeTo: '20:00',
      page: 2,
      limit: 5,
    });

    expect(useCase.execute).toHaveBeenCalledWith(
      'Manaus',
      'Parintins',
      '2026-03-06',
      '06:00',
      '20:00',
      2,
      5,
    );
  });

  it('delegates trip details lookup', () => {
    detailsUseCase.execute.mockReturnValue({
      id: 'trip-1',
      name: 'Expresso Rio Negro',
      status: 'em-transito',
      statusLabel: 'EM TRÂNSITO',
      currentPosition: {
        latitude: -3.119028,
        longitude: -60.021731,
      },
      itinerary: [],
      accommodationsStatus: 'disponivel',
      accommodations: [],
      notificationsEnabled: false,
    });

    const result = controller.getDetails('trip-1');

    expect(detailsUseCase.execute).toHaveBeenCalledWith('trip-1');
    expect(result.id).toBe('trip-1');
  });
});
