export type TripMapPosition = {
  latitude: number;
  longitude: number;
};

export type TripItineraryStop = {
  id: string;
  name: string;
  type: 'saida' | 'escala' | 'destino';
  time: string;
  description: string;
  status?: string;
};

export type TripAccommodation = {
  id: string;
  name: string;
  price: string;
  description?: string;
};

export type TripDetails = {
  id: string;
  name: string;
  status:
    | 'em-transito'
    | 'no-porto'
    | 'programado'
    | 'embarcando'
    | 'concluido'
    | 'cancelado'
    | 'atrasado';
  statusLabel: string;
  userDepartureDate?: string;
  userDepartureTime?: string;
  currentPosition: TripMapPosition;
  itinerary: TripItineraryStop[];
  accommodationsStatus: 'disponivel' | 'esgotado';
  accommodations: TripAccommodation[];
  notificationsEnabled: boolean;
  tracking: {
    available: boolean;
    live: boolean;
    lastPositionAt: string | null;
    contributorCount: number;
    confidenceLevel: 'ALTO' | 'MEDIO' | 'BAIXO';
    speedKmh: number | null;
    progressPercent: number | null;
    remainingDistanceKm: number | null;
    estimatedArrival: string | null;
  };
};
