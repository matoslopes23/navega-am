export type HomeDeparture = {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  status: 'no-porto' | 'embarcando' | 'programado';
  price: string;
  iconName: string;
  iconColor: string;
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
