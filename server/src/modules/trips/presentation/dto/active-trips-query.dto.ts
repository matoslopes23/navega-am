import { IsOptional, IsString, Length } from 'class-validator';

export class ActiveTripsQueryDto {
  @IsOptional()
  @IsString()
  @Length(2, 80)
  origin?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  destination?: string;
}
