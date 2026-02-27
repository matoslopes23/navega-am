import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './modules/health/presentation/health.controller';
import { GetHealthUseCase } from './modules/health/application/use-cases/get-health.usecase';
import { InMemoryHealthRepository } from './modules/health/infrastructure/repositories/in-memory-health.repository';
import { HEALTH_REPOSITORY } from './modules/health/health.tokens';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        GetHealthUseCase,
        {
          provide: HEALTH_REPOSITORY,
          useClass: InMemoryHealthRepository,
        },
      ],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('health', () => {
    it('should return status ok', async () => {
      const result = await healthController.getStatus();
      expect(result.status).toBe('ok');
      expect(result.service).toBe('navega-api');
      expect(result.timestamp).toEqual(expect.any(String));
    });
  });
});
