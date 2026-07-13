import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'joao@email.com' })
  @IsEmail()
  email!: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token recebido por e-mail.', minLength: 64 })
  @IsString()
  @Length(64, 64)
  token!: string;

  @ApiProperty({ example: 'NovaSenha123' })
  @IsString()
  @Length(8, 64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  password!: string;
}

export class PasswordResetRequestedResponseDto {
  @ApiProperty({
    example:
      'Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação.',
  })
  message!: string;
}

export class PasswordResetResponseDto {
  @ApiProperty({ example: true })
  changed!: boolean;
}
