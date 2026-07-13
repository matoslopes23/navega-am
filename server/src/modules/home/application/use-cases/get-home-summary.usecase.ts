import { Injectable } from '@nestjs/common';
import { HomeSummary } from '@modules/home/domain/home-summary';
import { ListActiveTripsUseCase } from '@modules/trips/application/use-cases/list-active-trips.usecase';

@Injectable()
export class GetHomeSummaryUseCase {
  constructor(private readonly listActiveTrips: ListActiveTripsUseCase) {}

  async execute(): Promise<HomeSummary> {
    const activeTrips = await this.listActiveTrips.execute();
    return {
      greeting: 'Olá, viajante!',
      subtitle: 'Para onde vamos navegar hoje?',
      departures: activeTrips.map((trip) => ({
        id: trip.id,
        name: trip.boatName,
        subtitle: `${trip.origin} → ${trip.destination}`,
        time: trip.departureTime,
        status: 'em-transito',
        price: trip.price,
        iconName: 'directions-boat',
        iconColor: '#0B5FD5',
        live: trip.live,
        contributorCount: trip.contributorCount,
      })),
      banner: {
        title: 'Curiosidade',
        subtitle: 'Descubra as rotas pelo Rio Negro',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      },
    };
  }
}
