import { Test } from '@nestjs/testing';

import { HomeController } from '@modules/home/presentation/home.controller';
import { GetHomeSummaryUseCase } from '@modules/home/application/use-cases/get-home-summary.usecase';
import { ListActiveTripsUseCase } from '@modules/trips/application/use-cases/list-active-trips.usecase';

describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        GetHomeSummaryUseCase,
        {
          provide: ListActiveTripsUseCase,
          useValue: { execute: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    controller = moduleRef.get(HomeController);
  });

  it('returns home summary', async () => {
    const result = await controller.getSummary();

    expect(result.greeting).toBe('Olá, viajante!');
    expect(result.departures).toHaveLength(0);
    expect(result.banner.title).toBe('Curiosidade');
  });
});
