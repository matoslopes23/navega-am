import { ApiProperty } from '@nestjs/swagger';

export class TripMapPositionDto {
  @ApiProperty({ example: -3.119028 })
  latitude!: number;

  @ApiProperty({ example: -60.021731 })
  longitude!: number;
}

export class TripItineraryStopDto {
  @ApiProperty({ example: 'manaus' })
  id!: string;

  @ApiProperty({ example: 'Manaus (Saída)' })
  name!: string;

  @ApiProperty({ example: 'saida', enum: ['saida', 'escala', 'destino'] })
  type!: 'saida' | 'escala' | 'destino';

  @ApiProperty({ example: '08:00' })
  time!: string;

  @ApiProperty({ example: 'Porto de Manaus - Roadway' })
  description!: string;

  @ApiProperty({ example: 'embarque', required: false })
  status?: string;
}

export class TripAccommodationDto {
  @ApiProperty({ example: 'rede' })
  id!: string;

  @ApiProperty({ example: 'Rede' })
  name!: string;

  @ApiProperty({ example: 'R$ 150' })
  price!: string;

  @ApiProperty({ example: 'Área com redes' })
  description?: string;
}

export class TripDetailsResponseDto {
  @ApiProperty({ example: 'b7c4b1f5-2b6e-4a66-85b0-47b1ad5a82a2' })
  id!: string;

  @ApiProperty({ example: 'Expresso Rio Negro' })
  name!: string;

  @ApiProperty({
    example: 'em-transito',
    enum: ['em-transito', 'no-porto', 'programado'],
  })
  status!: 'em-transito' | 'no-porto' | 'programado';

  @ApiProperty({ example: 'EM TRÂNSITO' })
  statusLabel!: string;

  @ApiProperty({ example: '2026-03-10', required: false })
  userDepartureDate?: string;

  @ApiProperty({ example: '14:30', required: false })
  userDepartureTime?: string;

  @ApiProperty({ type: TripMapPositionDto })
  currentPosition!: TripMapPositionDto;

  @ApiProperty({ type: TripItineraryStopDto, isArray: true })
  itinerary!: TripItineraryStopDto[];

  @ApiProperty({ example: 'disponivel', enum: ['disponivel', 'esgotado'] })
  accommodationsStatus!: 'disponivel' | 'esgotado';

  @ApiProperty({ type: TripAccommodationDto, isArray: true })
  accommodations!: TripAccommodationDto[];

  @ApiProperty({ example: false })
  notificationsEnabled!: boolean;
}
