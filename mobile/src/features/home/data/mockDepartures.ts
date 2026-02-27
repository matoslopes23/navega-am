export type Departure = {
  id: string;
  name: string;
  subtitle: string;
  time: string;
  status: 'no-porto' | 'embarcando' | 'programado';
  price: string;
  iconName: 'directions-boat' | 'directions-ferry' | 'sailing';
  iconColor: string;
};

export const mockDepartures: Departure[] = [
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
];
