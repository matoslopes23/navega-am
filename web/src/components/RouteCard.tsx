import { Anchor, Clock, Timer, Navigation2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type RouteStatus = "docked" | "navigating" | "maintenance";

interface RouteCardProps {
  type: string;
  status: RouteStatus;
  name: string;
  route: string;
  price: string;
  priceLabel: string;
  departureTime: string;
  duration: string;
  departureLabel?: string;
}

const statusConfig: Record<RouteStatus, { label: string; icon: React.ReactNode; className: string }> = {
  docked: {
    label: "No Porto",
    icon: <Anchor className="h-3.5 w-3.5" />,
    className: "bg-status-docked/15 text-status-docked",
  },
  navigating: {
    label: "Navegando",
    icon: <Navigation2 className="h-3.5 w-3.5" />,
    className: "bg-status-active/15 text-status-active",
  },
  maintenance: {
    label: "Em Manutenção",
    icon: <Wrench className="h-3.5 w-3.5" />,
    className: "bg-status-maintenance/15 text-status-maintenance",
  },
};

const RouteCard = ({
  type,
  status,
  name,
  route,
  price,
  priceLabel,
  departureTime,
  duration,
  departureLabel = "Partida",
}: RouteCardProps) => {
  const st = statusConfig[status];

  return (
    <div className="bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b bg-muted/30">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {type}
        </span>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${st.className}`}>
          {st.icon}
          {st.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground mt-0.5">{route}</p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">{price}</span>
          <span className="text-xs text-muted-foreground">{priceLabel}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-river-light" />
            <div>
              <span className="block text-[11px] uppercase tracking-wide">{departureLabel}</span>
              <span className="font-medium text-foreground">{departureTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="h-4 w-4 text-river-light" />
            <div>
              <span className="block text-[11px] uppercase tracking-wide">Duração</span>
              <span className="font-medium text-foreground">{duration}</span>
            </div>
          </div>
        </div>

        <Link to={`/route/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`}>
          <Button
            variant="outline"
            className="w-full mt-5 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Ver Detalhes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RouteCard;
