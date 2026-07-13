import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from '@app/app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Identifica a API Navega Amazonas' })
  @ApiOkResponse({ description: 'Mensagem de identificação do serviço.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
