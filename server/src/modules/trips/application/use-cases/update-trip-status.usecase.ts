import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { TripsRepository } from '../ports/trips.repository';
import { TRIPS_REPOSITORY } from '../../trips.tokens';
import { NotificationService } from '@modules/notifications/application/notification.service';
import { PrismaService } from '@shared/prisma/prisma.service';

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
    private readonly notifications: NotificationService,
    private readonly prisma: PrismaService,
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
    const updated = await this.repository.updateStatus(id, status);
    await Promise.all([
      this.prisma.tripTimelineEvent.create({
        data: {
          tripId: id,
          type: 'STATUS_CHANGED',
          title: `Status alterado para ${status}`,
          metadata: { previousStatus: current.status, status },
        },
      }),
      this.notifications.notifyTrip(
        id,
        'STATUS_CHANGED',
        'Atualização da viagem',
        `O status da viagem mudou para ${status}.`,
      ),
    ]);
    return updated;
  }
}
