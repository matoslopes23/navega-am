import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import RoutesSection from "@/components/RoutesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <SearchBar />
      <RoutesSection />
      <Footer />
    </div>
  );
};

export default Index;
