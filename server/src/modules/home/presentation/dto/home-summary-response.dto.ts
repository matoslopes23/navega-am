import { ApiProperty } from '@nestjs/swagger';

export class HomeDepartureResponseDto {
  @ApiProperty({ example: '1' })
  id!: string;

  @ApiProperty({ example: 'Comandante Souza' })
  name!: string;

  @ApiProperty({ example: 'Lancha • Expresso' })
  subtitle!: string;

  @ApiProperty({ example: '18:00' })
  time!: string;

  @ApiProperty({
    example: 'no-porto',
    enum: ['no-porto', 'embarcando', 'programado'],
  })
  status!: 'no-porto' | 'embarcando' | 'programado';

  @ApiProperty({ example: 'R$ 150' })
  price!: string;

  @ApiProperty({ example: 'directions-boat' })
  iconName!: string;

  @ApiProperty({ example: '#0B5FD5' })
  iconColor!: string;
}

export class HomeBannerResponseDto {
  @ApiProperty({ example: 'Curiosidade' })
  title!: string;

  @ApiProperty({ example: 'Descubra as rotas pelo Rio Negro' })
  subtitle!: string;

  @ApiProperty({
    example:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  })
  imageUrl!: string;
}

export class HomeSummaryResponseDto {
  @ApiProperty({ example: 'Olá, viajante!' })
  greeting!: string;

  @ApiProperty({ example: 'Para onde vamos navegar hoje?' })
  subtitle!: string;

  @ApiProperty({ type: HomeDepartureResponseDto, isArray: true })
  departures!: HomeDepartureResponseDto[];

  @ApiProperty({ type: HomeBannerResponseDto })
  banner!: HomeBannerResponseDto;
}
