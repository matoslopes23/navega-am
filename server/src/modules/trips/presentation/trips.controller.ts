import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';
import { SearchTripsDto } from '@modules/trips/application/dto/search-trips.dto';
import { TripResponseDto } from '@modules/trips/presentation/dto/trip-response.dto';
import { TripDetailsResponseDto } from '@modules/trips/presentation/dto/trip-details-response.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(
    private readonly searchTrips: SearchTripsUseCase,
    private readonly getTripDetails: GetTripDetailsUseCase,
  ) {}

  @Get('search')
  @ApiOkResponse({
    description: 'Lista de viagens filtradas por origem/destino e horários.',
    type: TripResponseDto,
    isArray: true,
  })
  search(@Query() query: SearchTripsDto) {
    return this.searchTrips.execute(
      query.origin,
      query.destination,
      query.date,
      query.timeFrom,
      query.timeTo,
      query.page,
      query.limit,
    );
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Detalhes completos da embarcação e itinerário.',
    type: TripDetailsResponseDto,
  })
  getDetails(@Param('id') id: string) {
    return this.getTripDetails.execute(id);
  }
}
