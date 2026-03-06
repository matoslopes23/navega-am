import { Ship } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Ship className="h-6 w-6" />
            <span className="text-lg font-bold tracking-tight">Navega AM</span>
          </div>
          <div className="flex gap-6 text-sm text-primary-foreground/70">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Política de Privacidade
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Ajuda
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © 2024 Navega AM. Conectando a Amazônia.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
