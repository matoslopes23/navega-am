import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  ArrayMaxSize,
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTripItineraryDto {
  @ApiProperty({ example: 'Manaus (Saída)' })
  @IsString()
  @Length(2, 120)
  name!: string;

  @ApiProperty({ example: 'saida', enum: ['saida', 'escala', 'destino'] })
  @IsString()
  @IsIn(['saida', 'escala', 'destino'])
  type!: 'saida' | 'escala' | 'destino';

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @ApiProperty({ example: 'Porto de Manaus - Roadway' })
  @IsString()
  @Length(2, 200)
  description!: string;

  @ApiPropertyOptional({ example: 'embarque' })
  @IsOptional()
  @IsString()
  @Length(2, 40)
  status?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  order?: number;
}

export class CreateTripAccommodationDto {
  @ApiProperty({ example: 'Rede' })
  @IsString()
  @Length(2, 80)
  name!: string;

  @ApiProperty({ example: 150 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  price!: number;

  @ApiPropertyOptional({ example: 'Área com redes' })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  description?: string;
}

export class CreateTripDto {
  @ApiProperty({ example: 'Expresso Rio Negro' })
  @IsString()
  @Length(2, 120)
  boatName!: string;

  @ApiProperty({ example: 'Ferry boat' })
  @IsString()
  @Length(2, 80)
  boatType!: string;

  @ApiProperty({ example: 350 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  price!: number;

  @ApiProperty({ example: 'Manaus' })
  @IsString()
  @Length(2, 80)
  origin!: string;

  @ApiProperty({ example: 'Parintins' })
  @IsString()
  @Length(2, 80)
  destination!: string;

  @ApiProperty({ example: '2026-03-06' })
  @IsDateString({ strict: true })
  departureDate!: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  departureTime!: string;

  @ApiPropertyOptional({
    example: 'programado',
    enum: ['em-transito', 'no-porto', 'programado'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['em-transito', 'no-porto', 'programado'])
  status?: 'em-transito' | 'no-porto' | 'programado';

  @ApiProperty({ example: -3.119028 })
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: -60.021731 })
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @ApiPropertyOptional({ example: -3.3836 })
  @IsOptional()
  @IsLatitude()
  destinationLatitude?: number;

  @ApiPropertyOptional({ example: -57.7186 })
  @IsOptional()
  @IsLongitude()
  destinationLongitude?: number;

  @ApiPropertyOptional({ type: CreateTripItineraryDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateTripItineraryDto)
  itinerary?: CreateTripItineraryDto[];

  @ApiPropertyOptional({ type: CreateTripAccommodationDto, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => CreateTripAccommodationDto)
  accommodations?: CreateTripAccommodationDto[];
}
