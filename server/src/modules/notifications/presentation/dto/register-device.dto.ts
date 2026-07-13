import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString, Length } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({
    example: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]',
    description: 'Token Expo, FCM ou APNs do dispositivo.',
  })
  @IsString()
  @Length(10, 500)
  token!: string;

  @ApiProperty({ enum: ['ios', 'android', 'web'], example: 'android' })
  @IsIn(['ios', 'android', 'web'])
  platform!: string;
}
