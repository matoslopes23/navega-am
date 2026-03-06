import { Test } from '@nestjs/testing';

import { HomeController } from '@modules/home/presentation/home.controller';
import { GetHomeSummaryUseCase } from '@modules/home/application/use-cases/get-home-summary.usecase';

describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [GetHomeSummaryUseCase],
    }).compile();

    controller = moduleRef.get(HomeController);
  });

  it('returns home summary', () => {
    const result = controller.getSummary();

    expect(result.greeting).toBe('Olá, viajante!');
    expect(result.departures).toHaveLength(3);
    expect(result.banner.title).toBe('Curiosidade');
  });
});
