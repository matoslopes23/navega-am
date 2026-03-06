import { Injectable } from '@nestjs/common';
import { TripDetails } from '@modules/trips/domain/trip-details';

@Injectable()
export class GetTripDetailsUseCase {
  execute(id: string): TripDetails {
    return {
      id,
      name: 'Expresso Rio Negro',
      status: 'em-transito',
      statusLabel: 'EM TRÂNSITO',
      currentPosition: {
        latitude: -3.119028,
        longitude: -60.021731,
      },
      itinerary: [
        {
          id: 'manaus',
          name: 'Manaus (Saída)',
          type: 'saida',
          time: '08:00',
          description: 'Porto de Manaus - Roadway',
        },
        {
          id: 'itacoatiara',
          name: 'Itacoatiara (Escala)',
          type: 'escala',
          time: '14:30',
          description: 'Em operação de embarque',
          status: 'embarque',
        },
        {
          id: 'parintins',
          name: 'Parintins (Destino)',
          type: 'destino',
          time: 'Amanhã, 06:00',
          description: 'Porto de Parintins',
        },
      ],
      accommodationsStatus: 'disponivel',
      accommodations: [
        {
          id: 'rede',
          name: 'Rede',
          price: 'R$ 150',
        },
        {
          id: 'cadeira',
          name: 'Cadeira',
          price: 'R$ 200',
        },
        {
          id: 'camarote',
          name: 'Camarote',
          price: 'R$ 650',
        },
      ],
      notificationsEnabled: false,
    };
  }
}
