import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '@modules/health/presentation/health.controller';
import { HealthModule } from '@modules/health/health.module';

describe('HealthController', () => {
  let healthController: HealthController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    healthController = app.get<HealthController>(HealthController);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('health', () => {
    it('should return status ok', async () => {
      const result = (await healthController.getStatus()) as {
        status: string;
        service: string;
        timestamp: string;
      };
      expect(result.status).toBe('ok');
      expect(result.service).toBe('navega-api');
      expect(result.timestamp).toEqual(expect.any(String));
    });

    it('should return metrics', async () => {
      const result = (await healthController.metrics()) as {
        uptime: number;
        timestamp: string;
        memoryUsage: NodeJS.MemoryUsage;
      };
      expect(typeof result.uptime).toBe('number');
      expect(typeof result.timestamp).toBe('string');
      expect(result.memoryUsage).toBeDefined();
    });
  });
});
