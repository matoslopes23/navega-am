import { Ship, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteCard from "./RouteCard";

const routes = [
  {
    type: "Lancha Jato",
    status: "docked" as const,
    name: "Expresso Ajuricaba",
    route: "Manaus → Itacoatiara",
    price: "R$ 150",
    priceLabel: "por passageiro",
    departureTime: "07:30",
    duration: "4h 30min",
  },
  {
    type: "Recreio",
    status: "navigating" as const,
    name: "N/M Comandante Souza",
    route: "Manaus → Parintins",
    price: "R$ 110",
    priceLabel: "Rede / por pessoa",
    departureTime: "19:00",
    duration: "18h 00min",
  },
  {
    type: "Ferry / Balsa",
    status: "maintenance" as const,
    name: "Balsa Rio Negro",
    route: "Manaus → Careiro",
    price: "R$ 80",
    priceLabel: "Veículo leve",
    departureTime: "A cada 1h",
    duration: "0h 45min",
    departureLabel: "Saídas",
  },
];

const RoutesSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center gap-3 mb-8">
          <Ship className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Resultados de Busca
          </h2>
        </div>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm" className="gap-2 text-muted-foreground">
            <ArrowUpDown className="h-4 w-4" />
            Ordenar
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {routes.map((route) => (
            <RouteCard key={route.name} {...route} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoutesSection;
