import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class SearchTripsDto {
  @ApiProperty({ example: 'Manaus' })
  @IsString()
  @Length(2, 80)
  origin!: string;

  @ApiProperty({ example: 'Parintins' })
  @IsString()
  @Length(2, 80)
  destination!: string;

  @ApiPropertyOptional({ example: '2026-03-06' })
  @IsOptional()
  @IsString()
  @Length(8, 10)
  date?: string;

  @ApiPropertyOptional({ example: '06:00' })
  @IsOptional()
  @IsString()
  @Length(4, 5)
  timeFrom?: string;

  @ApiPropertyOptional({ example: '20:00' })
  @IsOptional()
  @IsString()
  @Length(4, 5)
  timeTo?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
