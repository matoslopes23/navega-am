import { Compass } from "lucide-react";
import heroImage from "@/assets/hero-amazon.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-full px-4 py-2 mb-6">
          <Compass className="h-4 w-4 text-accent" />
          <span className="text-primary-foreground/90 text-sm font-medium">
            Transporte Fluvial na Amazônia
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
          Encontre sua rota fluvial na{" "}
          <span className="text-accent">Amazônia</span>
        </h1>

        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed">
          Navegue pelos rios da maior bacia hidrográfica do mundo com segurança,
          praticidade e informações em tempo real.
        </p>
      </div>
    </section>
  );
};

export default Hero;
