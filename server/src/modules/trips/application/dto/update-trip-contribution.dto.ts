import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateTripContributionDto {
  @ApiPropertyOptional({ example: '2026-03-10' })
  @IsOptional()
  @IsDateString({ strict: true })
  userDepartureDate?: string;

  @ApiPropertyOptional({ example: '14:30' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  userDepartureTime?: string;
}
