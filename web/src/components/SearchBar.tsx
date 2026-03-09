import { MapPin, Navigation, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getTripLocations, TripSearchParams } from "@/lib/trips";

type SearchBarProps = {
  onSearch: (params: TripSearchParams) => void;
  isLoading?: boolean;
};

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [origins, setOrigins] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    getTripLocations()
      .then((data) => {
        if (!isMounted) return;
        setOrigins(data.origins);
        setDestinations(data.destinations);
      })
      .catch(() => {
        if (!isMounted) return;
        setOrigins([]);
        setDestinations([]);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
              <Select value={origin} onValueChange={setOrigin}>
                <SelectTrigger className="pl-10 h-12 bg-muted/50 border-0 text-sm">
                  <SelectValue placeholder="Origem" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger className="pl-10 h-12 bg-muted/50 border-0 text-sm">
                  <SelectValue placeholder="Destino" />
                </SelectTrigger>
                <SelectContent>
                  {destinations.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="h-12 px-8 bg-primary hover:bg-river-light text-primary-foreground font-semibold gap-2"
              onClick={handleSearch}
              disabled={isLoading || origins.length === 0 || destinations.length === 0}
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
