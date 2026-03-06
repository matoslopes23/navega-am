import { ApiProperty } from '@nestjs/swagger';

export class TripResponseDto {
  @ApiProperty({ example: 'b7c4b1f5-2b6e-4a66-85b0-47b1ad5a82a2' })
  id!: string;

  @ApiProperty({ example: 'Comandante Souza' })
  boatName!: string;

  @ApiProperty({ example: 'Lancha • Expresso' })
  boatType!: string;

  @ApiProperty({ example: 'R$ 150' })
  price!: string;

  @ApiProperty({ example: '18:00' })
  departureTime!: string;

  @ApiProperty({ example: 'Manaus' })
  origin!: string;

  @ApiProperty({ example: 'Parintins' })
  destination!: string;
}
