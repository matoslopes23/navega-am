import { Module } from '@nestjs/common';

import { HomeController } from '@modules/home/presentation/home.controller';
import { GetHomeSummaryUseCase } from '@modules/home/application/use-cases/get-home-summary.usecase';
import { TripsModule } from '@modules/trips/trips.module';

@Module({
  imports: [TripsModule],
  controllers: [HomeController],
  providers: [GetHomeSummaryUseCase],
})
export class HomeModule {}
