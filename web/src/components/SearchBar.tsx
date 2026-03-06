import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { TripSearchParams } from "@/lib/trips";

type SearchBarProps = {
  onSearch: (params: TripSearchParams) => void;
  isLoading?: boolean;
};

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) return;
    onSearch({
      origin: origin.trim(),
      destination: destination.trim(),
      page: 1,
      limit: 12,
    });
  };

  return (
    <section className="relative z-20 -mt-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-card rounded-2xl shadow-xl border p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Origem (ex: Manaus)"
                className="pl-10 h-12 bg-muted/50 border-0 text-sm"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              />
            </div>
            <div className="relative flex-1">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Destino (ex: Parintins)"
                className="pl-10 h-12 bg-muted/50 border-0 text-sm"
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
              />
            </div>
            <Button
              className="h-12 px-8 bg-primary hover:bg-river-light text-primary-foreground font-semibold gap-2"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
              {isLoading ? "Buscando..." : "Buscar Rotas"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBar;
