import { ApiProperty } from '@nestjs/swagger';

export class TripLocationsResponseDto {
  @ApiProperty({
    example: ['Manaus', 'Itacoatiara', 'Parintins'],
  })
  origins!: string[];

  @ApiProperty({
    example: ['Parintins', 'Maués', 'Coari'],
  })
  destinations!: string[];
}
