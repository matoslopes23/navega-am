import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import RoutesSection from "@/components/RoutesSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchTrips, TripSearchParams } from "@/lib/trips";

const Index = () => {
  const [searchParams, setSearchParams] = useState<TripSearchParams | null>(null);
  const { data, isLoading, error } = useQuery({
    queryKey: ["trips", searchParams],
    queryFn: () => searchTrips(searchParams as TripSearchParams),
    enabled: Boolean(searchParams?.origin && searchParams?.destination),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SearchBar
        onSearch={(params) => setSearchParams(params)}
        isLoading={isLoading}
      />
      <RoutesSection
        routes={data ?? []}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : undefined}
      />
      <Footer />
    </div>
  );
};

export default Index;
