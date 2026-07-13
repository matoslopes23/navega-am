import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Maria da Silva' })
  @IsOptional()
  @IsString()
  @Length(3, 120)
  name?: string;

  @ApiPropertyOptional({ example: '(92) 99999-9999' })
  @IsOptional()
  @Matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/)
  phone?: string;
}

export class ConsentDto {
  @ApiProperty({
    example: true,
    description: 'Consentimento explícito necessário para iniciar tracking.',
  })
  @IsBoolean()
  consent!: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'SenhaAtual123' })
  @IsString()
  @Length(8, 64)
  currentPassword!: string;

  @ApiProperty({ example: 'NovaSenha123' })
  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  newPassword!: string;
}
