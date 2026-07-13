import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @Length(3, 120)
  name!: string;

  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '(92) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/, { message: 'Telefone inválido.' })
  phone?: string;

  @ApiProperty({ example: '000.000.000-00' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf!: string;

  @ApiProperty({ example: 'Senha@123' })
  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'A senha deve conter letras maiúsculas, minúsculas e números.',
  })
  password!: string;
}
