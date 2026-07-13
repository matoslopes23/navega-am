import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class GpsPointDto {
  @ApiProperty({ example: -3.119028 })
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  @ApiProperty({ example: -60.021731 })
  longitude: number;

  @IsDateString({ strict: true })
  @ApiProperty({
    example: '2026-07-13T14:00:00.000Z',
    description:
      'Instante original da captura, inclusive para sincronização offline.',
  })
  pingedAt: string;

  @IsOptional()
  @IsUUID()
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Chave idempotente gerada no dispositivo.',
  })
  clientPointId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  @ApiPropertyOptional({ example: 12.5, description: 'Precisão em metros.' })
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  @ApiPropertyOptional({
    example: 6.4,
    description: 'Velocidade em metros por segundo.',
  })
  speed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  @ApiPropertyOptional({ example: 270, description: 'Direção em graus.' })
  heading?: number;
}

export class SyncGpsDto {
  @ApiProperty({ format: 'uuid', description: 'Viagem em trânsito.' })
  @IsUUID()
  tripId: string;

  @IsString()
  @Length(16, 128)
  @ApiProperty({
    example: 'substituido-pelo-usuario-autenticado',
    description: 'Identificador estável da instalação do aplicativo.',
  })
  deviceId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => GpsPointDto)
  @ApiProperty({ type: GpsPointDto, isArray: true, maxItems: 100 })
  locations: GpsPointDto[];
}
