import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { SyncGpsBatchUseCase } from './application/use-cases/sync-gps-batch.use-case';
import { ProcessGpsBatchUseCase } from './application/use-cases/process-gps-batch.use-case';
import { TrackingProcessor } from './infrastructure/queue/tracking.processor';
import { BullTrackingQueueAdapter } from './infrastructure/queue/bull-tracking-queue.adapter';
import { PrismaTrackingRepository } from './infrastructure/repositores/prisma-tracking.repository';
import { SocketRealTimeEmitterAdapter } from './infrastructure/adapters/socket-real-time-emitter.adapter';

import { TrackingTokens } from './tracking.tokens';
import { PrismaModule } from '../../shared/prisma/prisma.module'; // Ajuste o path se necessário
import { TrackingController } from './presentation/tracking.controller';
import { GetLastBoatLocationUseCase } from './application/use-cases/get-last-boat-location.use-case';
import { PrismaTrackingQueryRepository } from './infrastructure/repositores/prisma-tracking-query.repository';
import { RealTimeModule } from '../real-time/real-time.moule';
import { AuthModule } from '../auth/auth.module';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'gps-processing',
    }),
    forwardRef(() => RealTimeModule),
    AuthModule,
    PrismaModule, // Injeta o PrismaService global
  ],
  controllers: [TrackingController],
  providers: [
    // Use Cases
    SyncGpsBatchUseCase,
    ProcessGpsBatchUseCase,
    GetLastBoatLocationUseCase,
    RateLimitGuard,

    // Workers / Processors
    TrackingProcessor,

    // Mapeamento de Dependências (Ports & Adapters)
    {
      provide: TrackingTokens.TRACKING_REPOSITORY_PORT,
      useClass: PrismaTrackingRepository,
    },
    {
      provide: TrackingTokens.TRACKING_QUERY_REPOSITORY_PORT,
      useClass: PrismaTrackingQueryRepository,
    },
    {
      provide: TrackingTokens.TRACKING_QUEUE_PORT,
      useClass: BullTrackingQueueAdapter,
    },
    {
      provide: TrackingTokens.REAL_TIME_EMITTER_PORT,
      useClass: SocketRealTimeEmitterAdapter,
    },
  ],
  exports: [GetLastBoatLocationUseCase], // Permite que o módulo RealTime o use
})
export class TrackingModule {}
