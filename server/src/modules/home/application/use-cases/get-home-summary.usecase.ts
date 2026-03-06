import { Injectable } from '@nestjs/common';
import { HomeSummary } from '@modules/home/domain/home-summary';

@Injectable()
export class GetHomeSummaryUseCase {
  execute(): HomeSummary {
    return {
      greeting: 'Olá, viajante!',
      subtitle: 'Para onde vamos navegar hoje?',
      departures: [
        {
          id: '1',
          name: 'Comandante Souza',
          subtitle: 'Lancha • Expresso',
          time: '18:00',
          status: 'no-porto',
          price: 'R$ 150',
          iconName: 'directions-boat',
          iconColor: '#0B5FD5',
        },
        {
          id: '2',
          name: 'N/M Ana Karoline',
          subtitle: 'Recreio • Regional',
          time: '19:30',
          status: 'embarcando',
          price: 'R$ 80',
          iconName: 'directions-ferry',
          iconColor: '#F59E0B',
        },
        {
          id: '3',
          name: 'Iate Princesa',
          subtitle: 'Catamarã • VIP',
          time: '06:00 (Amanhã)',
          status: 'programado',
          price: 'R$ 220',
          iconName: 'sailing',
          iconColor: '#2563EB',
        },
      ],
      banner: {
        title: 'Curiosidade',
        subtitle: 'Descubra as rotas pelo Rio Negro',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    };
  }
}
