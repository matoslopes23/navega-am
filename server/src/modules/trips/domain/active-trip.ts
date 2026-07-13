export type ActiveTrip = {
  id: string;
  boatName: string;
  boatType: string;
  origin: string;
  destination: string;
  departureTime: string;
  price: string;
  status: 'em-transito';
  live: boolean;
  position: {
    latitude: number;
    longitude: number;
    calculatedAt: string;
  } | null;
  confidenceLevel: 'ALTO' | 'MEDIO' | 'BAIXO';
  contributorCount: number;
  speedKmh: number | null;
  progressPercent: number | null;
  remainingDistanceKm: number | null;
  estimatedArrival: string | null;
};
