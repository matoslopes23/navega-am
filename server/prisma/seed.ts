import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DAY_MAP: Record<string, number> = {
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
  domingo: 0,
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();

const nextWeekday = (weekday: string, baseDate = new Date()): Date => {
  const normalized = normalizeText(weekday);
  const target = DAY_MAP[normalized];
  if (target === undefined) return baseDate;

  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  const diff = (target - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
};

const resolveBoatType = (boatName: string) => {
  if (boatName.startsWith('N/M')) return 'Navio';
  if (boatName.startsWith('F/B')) return 'Balsa';
  return 'Embarcação';
};

const CSV_PATH = path.resolve(
  __dirname,
  '../dataimports/tabela_precos_embarcacoes_manaus.csv',
);

async function main() {
  const file = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = file.split(/\r?\n/).filter(Boolean);
  const [, ...rows] = lines;

  for (const row of rows) {
    const [
      embarcacao,
      saidaDia,
      saidaHora,
      chegadaDia,
      chegadaHora,
      destino,
      classificacaoDestino,
      precoPassagem,
    ] = row.split(',').map((item) => item.trim());

    if (!embarcacao || !destino || !saidaHora) continue;

    const departureDate = nextWeekday(saidaDia);
    const price = Math.round(Number(precoPassagem));

    const existing = await prisma.trip.findFirst({
      where: {
        boatName: embarcacao,
        destination: destino,
        departureDate,
        departureTime: saidaHora,
      },
    });

    if (existing) {
      continue;
    }

    await prisma.trip.create({
      data: {
        boatName: embarcacao,
        boatType: resolveBoatType(embarcacao),
        price: Number.isNaN(price) ? 0 : price,
        origin: 'Manaus',
        destination: destino,
        departureDate,
        departureTime: saidaHora,
        status: 'programado',
        latitude: -3.119028,
        longitude: -60.021731,
        itineraries: {
          create: [
            {
              name: 'Manaus (Saída)',
              type: 'saida',
              time: saidaHora,
              description: 'Porto de Manaus - Roadway',
              order: 1,
            },
            {
              name: `${destino} (Destino)`,
              type: 'destino',
              time: chegadaHora || '00:00',
              description: `Chegada prevista ${chegadaDia}`,
              order: 2,
            },
          ],
        },
        accommodations: {
          create: [
            {
              name: classificacaoDestino || 'Passagem',
              price: Number.isNaN(price) ? 0 : price,
              description: classificacaoDestino
                ? `Categoria ${classificacaoDestino}`
                : 'Passagem padrão',
            },
          ],
        },
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
