import { apiFetch } from "@/lib/api";

export type TripSearchResult = {
  id: string;
  boatName: string;
  boatType: string;
  price: string;
  departureTime: string;
  origin: string;
  destination: string;
};

export type TripDetails = {
  id: string;
  name: string;
  status: "em-transito" | "no-porto" | "programado";
  statusLabel: string;
  userDepartureDate?: string;
  userDepartureTime?: string;
  currentPosition: {
    latitude: number;
    longitude: number;
  };
  itinerary: Array<{
    id: string;
    name: string;
    type: "saida" | "escala" | "destino";
    time: string;
    description: string;
    status?: string;
  }>;
  accommodationsStatus: "disponivel" | "esgotado";
  accommodations: Array<{
    id: string;
    name: string;
    price: string;
    description?: string;
  }>;
  notificationsEnabled: boolean;
};

export type TripSearchParams = {
  origin: string;
  destination: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
  page?: number;
  limit?: number;
};

export const searchTrips = async (params: TripSearchParams) => {
  const query = new URLSearchParams();
  query.set("origin", params.origin);
  query.set("destination", params.destination);

  if (params.date) query.set("date", params.date);
  if (params.timeFrom) query.set("timeFrom", params.timeFrom);
  if (params.timeTo) query.set("timeTo", params.timeTo);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<TripSearchResult[]>(`/trips/search?${query.toString()}`);
};

export const getTripDetails = async (id: string) =>
  apiFetch<TripDetails>(`/trips/${id}`);

export const getTripLocations = async () =>
  apiFetch<{ origins: string[]; destinations: string[] }>(
    '/trips/locations',
  );
