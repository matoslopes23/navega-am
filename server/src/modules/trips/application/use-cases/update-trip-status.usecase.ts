import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TripsRepository } from '../ports/trips.repository';
import { TRIPS_REPOSITORY } from '../../trips.tokens';

export type OperationalTripStatus =
  | 'programado'
  | 'no-porto'
  | 'embarcando'
  | 'em-transito'
  | 'atrasado'
  | 'concluido'
  | 'cancelado';

@Injectable()
export class UpdateTripStatusUseCase {
  constructor(
    @Inject(TRIPS_REPOSITORY) private readonly repository: TripsRepository,
  ) {}

  async execute(id: string, status: OperationalTripStatus) {
    const current = await this.repository.findDetailsById(id);
    if (!current) throw new NotFoundException('Viagem não encontrada.');
    const transitions: Record<string, OperationalTripStatus[]> = {
      programado: ['no-porto', 'embarcando', 'atrasado', 'cancelado'],
      atrasado: ['no-porto', 'embarcando', 'cancelado'],
      'no-porto': ['embarcando', 'em-transito', 'cancelado'],
      embarcando: ['em-transito', 'cancelado'],
      'em-transito': ['no-porto', 'concluido'],
      concluido: [],
      cancelado: [],
    };
    if (!transitions[current.status]?.includes(status)) {
      throw new BadRequestException(
        `Transição inválida: ${current.status} → ${status}.`,
      );
    }
    return this.repository.updateStatus(id, status);
  }
}
