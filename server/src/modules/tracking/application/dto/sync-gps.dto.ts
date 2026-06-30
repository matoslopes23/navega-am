import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class GpsPointDto {
    @IsNumber()
    @IsNotEmpty()
    latitude: number;

    @IsNumber()
    @IsNotEmpty()
    longitude: number;

    @IsString()
    @IsNotEmpty()
    pingedAt: string;
}

export class SyncGpsDto {
    @IsUUID()
    @IsNotEmpty()
    tripId: string;

    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => GpsPointDto)
    locations: GpsPointDto[];
}