import { Ship, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import RouteCard from "./RouteCard";
import { TripSearchResult } from "@/lib/trips";

type RoutesSectionProps = {
  routes: TripSearchResult[];
  isLoading?: boolean;
  error?: string;
};

const RoutesSection = ({ routes, isLoading = false, error }: RoutesSectionProps) => {
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

        {isLoading && (
          <p className="text-sm text-muted-foreground">Buscando rotas...</p>
        )}
        {error && (
          <p className="text-sm text-destructive">
            Não foi possível carregar as rotas. Tente novamente.
          </p>
        )}
        {!isLoading && !error && routes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Informe origem e destino para buscar rotas disponíveis.
          </p>
        )}

        {!isLoading && !error && routes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                id={route.id}
                type={route.boatType}
                status="navigating"
                name={route.boatName}
                route={`${route.origin} → ${route.destination}`}
                price={route.price}
                priceLabel="por passageiro"
                departureTime={route.departureTime}
                duration="-"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RoutesSection;
