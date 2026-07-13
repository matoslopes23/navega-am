import { IsIn } from 'class-validator';
import type { OperationalTripStatus } from '../use-cases/update-trip-status.usecase';

export class UpdateTripStatusDto {
  @IsIn([
    'programado',
    'no-porto',
    'embarcando',
    'em-transito',
    'atrasado',
    'concluido',
    'cancelado',
  ])
  status!: OperationalTripStatus;
}
