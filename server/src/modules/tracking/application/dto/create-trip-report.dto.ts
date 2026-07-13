import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTripReportDto {
  @ApiProperty({
    enum: ['DELAY', 'STOPPED', 'BREAKDOWN', 'SAFETY', 'OTHER'],
    example: 'DELAY',
  })
  @IsIn(['DELAY', 'STOPPED', 'BREAKDOWN', 'SAFETY', 'OTHER'])
  type!: 'DELAY' | 'STOPPED' | 'BREAKDOWN' | 'SAFETY' | 'OTHER';

  @IsOptional()
  @IsString()
  @Length(3, 500)
  @ApiPropertyOptional({
    example: 'Embarcação parada há aproximadamente 30 minutos.',
  })
  description?: string;

  @IsOptional()
  @IsLatitude()
  @ApiPropertyOptional({ example: -3.119028 })
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  @ApiPropertyOptional({ example: -60.021731 })
  longitude?: number;
}

export class CreateManualPositionDto {
  @ApiProperty({ example: -3.119028 })
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  @ApiProperty({ example: -60.021731 })
  longitude!: number;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  @ApiPropertyOptional({ example: 'Posição observada pelo passageiro.' })
  description?: string;
}

export class ModerateTripReportDto {
  @ApiProperty({ enum: ['CONFIRMED', 'REJECTED'], example: 'CONFIRMED' })
  @IsIn(['CONFIRMED', 'REJECTED'])
  status!: 'CONFIRMED' | 'REJECTED';
}
