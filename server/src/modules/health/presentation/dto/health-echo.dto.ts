import { IsString, Length } from 'class-validator';

export class HealthEchoDto {
  @IsString()
  @Length(1, 120)
  message!: string;
}
