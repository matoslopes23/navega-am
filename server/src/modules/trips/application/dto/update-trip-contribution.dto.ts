import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateTripContributionDto {
  @ApiPropertyOptional({ example: '2026-03-10' })
  @IsOptional()
  @IsString()
  @Length(8, 10)
  userDepartureDate?: string;

  @ApiPropertyOptional({ example: '14:30' })
  @IsOptional()
  @IsString()
  @Length(4, 5)
  userDepartureTime?: string;
}
