import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsString()
  @Length(3, 120)
  identifier!: string;

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @Length(6, 64)
  password!: string;
}
