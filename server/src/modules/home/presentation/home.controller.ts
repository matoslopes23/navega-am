import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetHomeSummaryUseCase } from '@modules/home/application/use-cases/get-home-summary.usecase';
import { HomeSummaryResponseDto } from '@modules/home/presentation/dto/home-summary-response.dto';

@ApiTags('Home')
@Controller('home')
export class HomeController {
  constructor(private readonly getHomeSummary: GetHomeSummaryUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtém os dados consolidados da tela inicial' })
  @ApiOkResponse({
    description: 'Resumo inicial da tela inicial.',
    type: HomeSummaryResponseDto,
  })
  getSummary() {
    return this.getHomeSummary.execute();
  }
}
