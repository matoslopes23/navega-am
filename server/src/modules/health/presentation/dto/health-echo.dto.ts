import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HealthEchoDto {
  @ApiProperty({ example: 'pong' })
  @IsString()
  @Length(1, 120)
  message!: string;
}
