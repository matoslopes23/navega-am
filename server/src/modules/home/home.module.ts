import { Module } from '@nestjs/common';

import { HomeController } from '@modules/home/presentation/home.controller';
import { GetHomeSummaryUseCase } from '@modules/home/application/use-cases/get-home-summary.usecase';

@Module({
  controllers: [HomeController],
  providers: [GetHomeSummaryUseCase],
})
export class HomeModule {}
