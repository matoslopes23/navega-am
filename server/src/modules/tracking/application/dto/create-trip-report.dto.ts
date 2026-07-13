import {
  IsIn,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateTripReportDto {
  @IsIn(['DELAY', 'STOPPED', 'BREAKDOWN', 'SAFETY', 'OTHER'])
  type!: 'DELAY' | 'STOPPED' | 'BREAKDOWN' | 'SAFETY' | 'OTHER';

  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class CreateManualPositionDto {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;
}

export class ModerateTripReportDto {
  @IsIn(['CONFIRMED', 'REJECTED'])
  status!: 'CONFIRMED' | 'REJECTED';
}
