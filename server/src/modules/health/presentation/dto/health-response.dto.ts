import { ApiProperty } from '@nestjs/swagger';

export class HealthStatusResponseDto {
  @ApiProperty({ example: 'ok', enum: ['ok'] })
  status!: 'ok';

  @ApiProperty({ example: 'navega-api' })
  service!: 'navega-api';

  @ApiProperty({ example: '2026-03-06T12:00:00.000Z' })
  timestamp!: string;
}

export class HealthEchoResponseDto {
  @ApiProperty({ example: 'pong' })
  message!: string;
}

export class HealthMemoryUsageResponseDto {
  @ApiProperty({ example: 12345678 })
  rss!: number;

  @ApiProperty({ example: 8765432 })
  heapTotal!: number;

  @ApiProperty({ example: 4567890 })
  heapUsed!: number;

  @ApiProperty({ example: 123456 })
  external!: number;

  @ApiProperty({ example: 12345 })
  arrayBuffers!: number;
}

export class HealthMetricsResponseDto {
  @ApiProperty({ example: 1234.56 })
  uptime!: number;

  @ApiProperty({ type: HealthMemoryUsageResponseDto })
  memoryUsage!: HealthMemoryUsageResponseDto;

  @ApiProperty({ example: '2026-03-06T12:00:00.000Z' })
  timestamp!: string;
}
