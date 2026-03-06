/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';

import { TripsController } from '@modules/trips/presentation/trips.controller';
import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';
import { UpdateTripContributionUseCase } from '@modules/trips/application/use-cases/update-trip-contribution.usecase';

describe('TripsController', () => {
  let controller: TripsController;
  let useCase: jest.Mocked<SearchTripsUseCase>;
  let detailsUseCase: jest.Mocked<GetTripDetailsUseCase>;
  let updateContributionUseCase: jest.Mocked<UpdateTripContributionUseCase>;

  beforeEach(async () => {
    const useCaseMock = {
      execute: jest.fn(),
    };
    const detailsUseCaseMock = {
      execute: jest.fn(),
    };
    const updateContributionUseCaseMock = {
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
        {
          provide: UpdateTripContributionUseCase,
          useValue: updateContributionUseCaseMock,
        },
      ],
    }).compile();

    controller = moduleRef.get(TripsController);
    useCase = moduleRef.get(SearchTripsUseCase);
    detailsUseCase = moduleRef.get(GetTripDetailsUseCase);
    updateContributionUseCase = moduleRef.get(UpdateTripContributionUseCase);
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

  it('delegates trip details lookup', async () => {
    detailsUseCase.execute.mockResolvedValue({
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

    const result = await controller.getDetails('trip-1');

    expect(detailsUseCase.execute).toHaveBeenCalledWith('trip-1');
    expect(result.id).toBe('trip-1');
  });

  it('delegates contribution update', async () => {
    updateContributionUseCase.execute.mockResolvedValue({
      id: 'trip-1',
      name: 'Expresso Rio Negro',
      status: 'programado',
      statusLabel: 'PROGRAMADO',
      userDepartureDate: '2026-03-10',
      userDepartureTime: '14:30',
      currentPosition: {
        latitude: -3.119028,
        longitude: -60.021731,
      },
      itinerary: [],
      accommodationsStatus: 'disponivel',
      accommodations: [],
      notificationsEnabled: false,
    });

    const result = await controller.updateContribution('trip-1', {
      userDepartureDate: '2026-03-10',
      userDepartureTime: '14:30',
    });

    expect(updateContributionUseCase.execute).toHaveBeenCalledWith({
      id: 'trip-1',
      userDepartureDate: '2026-03-10',
      userDepartureTime: '14:30',
    });
    expect(result.userDepartureTime).toBe('14:30');
  });
});
