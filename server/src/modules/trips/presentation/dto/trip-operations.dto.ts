import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreatePortDto {
  @ApiProperty({ example: 'Porto de Manaus' })
  @IsString()
  @Length(2, 120)
  name!: string;
  @ApiProperty({ example: 'Manaus' }) @IsString() @Length(2, 120) city!: string;
  @ApiProperty({ example: -3.119028 }) @IsLatitude() latitude!: number;
  @ApiProperty({ example: -60.021731 }) @IsLongitude() longitude!: number;
  @ApiPropertyOptional({ example: 1000, description: 'Raio em metros.' })
  @IsOptional()
  @IsNumber()
  @Min(100)
  radiusMeters?: number;
}

export class CreateRiverRouteDto {
  @ApiProperty({ example: 'Manaus → Maués' })
  @IsString()
  @Length(2, 120)
  name!: string;
  @ApiProperty({ example: 'Manaus' })
  @IsString()
  @Length(2, 120)
  originName!: string;
  @ApiProperty({ example: 'Maués' })
  @IsString()
  @Length(2, 120)
  destinationName!: string;
  @ApiProperty({
    example: {
      type: 'LineString',
      coordinates: [
        [-60.02, -3.11],
        [-57.71, -3.38],
      ],
    },
  })
  @IsObject()
  geometry!: Record<string, unknown>;
  @ApiPropertyOptional({ example: 267.4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  distanceKm?: number;
}

export class AssignTripRouteDto {
  @ApiProperty({ format: 'uuid' }) @IsUUID() routeId!: string;
}
