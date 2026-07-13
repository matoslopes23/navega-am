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

class GpsPointDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsDateString({ strict: true })
  pingedAt: string;

  @IsOptional()
  @IsUUID()
  clientPointId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  speed?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(360)
  heading?: number;
}

export class SyncGpsDto {
  @IsUUID()
  tripId: string;

  @IsString()
  @Length(16, 128)
  deviceId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => GpsPointDto)
  locations: GpsPointDto[];
}
