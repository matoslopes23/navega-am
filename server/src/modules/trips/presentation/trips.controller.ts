import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { SearchTripsUseCase } from '@modules/trips/application/use-cases/search-trips.usecase';
import { GetTripDetailsUseCase } from '@modules/trips/application/use-cases/get-trip-details.usecase';
import { UpdateTripContributionUseCase } from '@modules/trips/application/use-cases/update-trip-contribution.usecase';
import { ListTripLocationsUseCase } from '@modules/trips/application/use-cases/list-trip-locations.usecase';
import { CreateTripUseCase } from '@modules/trips/application/use-cases/create-trip.usecase';
import { SearchTripsDto } from '@modules/trips/application/dto/search-trips.dto';
import { UpdateTripContributionDto } from '@modules/trips/application/dto/update-trip-contribution.dto';
import { CreateTripDto } from '@modules/trips/application/dto/create-trip.dto';
import { TripResponseDto } from '@modules/trips/presentation/dto/trip-response.dto';
import { TripDetailsResponseDto } from '@modules/trips/presentation/dto/trip-details-response.dto';
import { TripLocationsResponseDto } from '@modules/trips/presentation/dto/trip-locations-response.dto';
import { JwtAuthGuard } from '@modules/auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '@modules/auth/presentation/guards/roles.guard';
import { Roles } from '@modules/auth/presentation/decorators/roles.decorator';
import { RateLimitGuard } from '@shared/guards/rate-limit.guard';
import { ListActiveTripsUseCase } from '../application/use-cases/list-active-trips.usecase';
import { ActiveTripsQueryDto } from './dto/active-trips-query.dto';
import { UpdateTripStatusUseCase } from '../application/use-cases/update-trip-status.usecase';
import { UpdateTripStatusDto } from '../application/dto/update-trip-status.dto';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  constructor(
    private readonly searchTrips: SearchTripsUseCase,
    private readonly getTripDetails: GetTripDetailsUseCase,
    private readonly updateTripContribution: UpdateTripContributionUseCase,
    private readonly listTripLocations: ListTripLocationsUseCase,
    private readonly createTrip: CreateTripUseCase,
    private readonly listActiveTrips: ListActiveTripsUseCase,
    private readonly updateTripStatus: UpdateTripStatusUseCase,
  ) {}

  @Get('locations')
  @ApiOkResponse({
    description: 'Lista de origens e destinos disponíveis nas viagens.',
    type: TripLocationsResponseDto,
  })
  listLocations() {
    return this.listTripLocations.execute();
  }

  @Post()
  @UseGuards(RateLimitGuard, JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Viagem cadastrada com sucesso.',
    type: TripDetailsResponseDto,
  })
  create(@Body() body: CreateTripDto) {
    return this.createTrip.execute(body);
  }

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

  @Get('active')
  @ApiOkResponse({
    description: 'Lista viagens em trânsito e seu estado ao vivo.',
  })
  active(@Query() query: ActiveTripsQueryDto) {
    return this.listActiveTrips.execute(query.origin, query.destination);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Detalhes completos da embarcação e itinerário.',
    type: TripDetailsResponseDto,
  })
  getDetails(@Param('id') id: string) {
    return this.getTripDetails.execute(id);
  }

  @Patch(':id/contribution')
  @UseGuards(RateLimitGuard, JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Atualiza o horário informado pela comunidade para a viagem.',
    type: TripDetailsResponseDto,
  })
  updateContribution(
    @Param('id') id: string,
    @Body() body: UpdateTripContributionDto,
  ) {
    return this.updateTripContribution.execute({
      id,
      userDepartureDate: body.userDepartureDate,
      userDepartureTime: body.userDepartureTime,
    });
  }

  @Patch(':id/status')
  @UseGuards(RateLimitGuard, JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  updateStatus(@Param('id') id: string, @Body() body: UpdateTripStatusDto) {
    return this.updateTripStatus.execute(id, body.status);
  }
}
