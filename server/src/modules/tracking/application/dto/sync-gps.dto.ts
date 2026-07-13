import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsLatitude,
  IsLongitude,
  IsString,
  IsUUID,
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
