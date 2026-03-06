import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: '9d2c1f5b-7a1c-4b7d-9c6a-3c2c1e0f5c12' })
  id!: string;

  @ApiProperty({ example: 'João da Silva' })
  name!: string;

  @ApiProperty({ example: 'joao@email.com' })
  email!: string;

  @ApiProperty({ example: '(92) 99999-9999', required: false, nullable: true })
  phone?: string | null;

  @ApiProperty({ example: '000.000.000-00' })
  cpf!: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: AuthUserResponseDto })
  user!: AuthUserResponseDto;
}
