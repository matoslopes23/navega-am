export type HomeDeparture = {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  status: 'no-porto' | 'em-transito' | 'programado';
  price: string;
  iconName: string;
  iconColor: string;
  live?: boolean;
  contributorCount?: number;
};

export type HomeBanner = {
  title: string;
  subtitle: string;
  imageUrl: string;
};

export type HomeSummary = {
  greeting: string;
  subtitle: string;
  departures: HomeDeparture[];
  banner: HomeBanner;
};
