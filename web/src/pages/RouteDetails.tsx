import { Link } from "react-router-dom";
import {
  Share2,
  Bell,
  MapPin,
  Clock,
  Navigation2,
  Wifi,
  UtensilsCrossed,
  Snowflake,
  LifeBuoy,
  Printer,
  Download,
  FileText,
  Ship,
  Armchair,
  BedDouble,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import boatImage from "@/assets/boat-detail.jpg";
import { useState } from "react";

type TicketType = "hammock" | "seat" | "cabin";

const tickets: { id: TicketType; label: string; tier: string; price: string; priceLabel: string; icon: React.ReactNode }[] = [
  { id: "hammock", label: "Rede (Hammock)", tier: "STANDARD", price: "R$ 85", priceLabel: "por adulto", icon: <BedDouble className="h-5 w-5" /> },
  { id: "seat", label: "Cadeira (Seat)", tier: "EXECUTIVE", price: "R$ 120", priceLabel: "por adulto", icon: <Armchair className="h-5 w-5" /> },
  { id: "cabin", label: "Camarote (Cabin)", tier: "PREMIUM", price: "R$ 350", priceLabel: "2 pessoas", icon: <Ship className="h-5 w-5" /> },
];

const schedule = [
  { type: "Departure", label: "Partida", location: "Porto de Manaus (Roadway)", time: "08:00 AM", status: "Scheduled" },
  { type: "Intermediate Stop", label: "Parada Intermediária", location: "Itapiranga Terminal", time: "02:30 PM", status: "Estimated Arrival" },
  { type: "Final Arrival", label: "Chegada Final", location: "Porto de Itacoatiara", time: "06:45 PM", status: "Estimated Arrival" },
];

const amenities = [
  { icon: <Wifi className="h-6 w-6" />, label: "FREE WI-FI" },
  { icon: <UtensilsCrossed className="h-6 w-6" />, label: "CAFETERIA" },
  { icon: <Snowflake className="h-6 w-6" />, label: "FULL A/C" },
  { icon: <LifeBuoy className="h-6 w-6" />, label: "LIFEJACKETS" },
];

const RouteDetails = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketType>("cabin");

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero banner */}
      <div className="relative pt-14">
        <div className="h-56 md:h-72 overflow-hidden">
          <img src={boatImage} alt="Expresso Ajuricaba" className="w-full h-full object-cover" />
          <div className="absolute inset-0 top-14 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-status-active text-primary-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground animate-pulse" />
                IN TRANSIT
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">Expresso Ajuricaba</h1>
            <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
              <MapPin className="h-3.5 w-3.5" /> Manaus → Itacoatiara
            </p>

            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1.5 text-xs">
                <Share2 className="h-3.5 w-3.5" /> Share
              </Button>
              <Button size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-1.5 text-xs font-semibold">
                <Bell className="h-3.5 w-3.5" /> Get Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Voltar aos resultados
        </Link>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Live map placeholder */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Navigation2 className="h-4 w-4 text-primary" /> Live River Route
                </h2>
                <span className="text-xs text-muted-foreground">Updated 2 mins ago</span>
              </div>
              <div className="h-64 md:h-80 bg-muted/50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-60.0,-3.1,8,0/800x400?access_token=placeholder')] bg-cover bg-center opacity-30" />
                <div className="relative text-center">
                  <div className="h-4 w-4 rounded-full bg-primary mx-auto mb-2 ring-4 ring-primary/20" />
                  <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded shadow-sm">Current Position</span>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b">
                <Clock className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-foreground">Estimated Schedule</h2>
              </div>
              <div className="p-5">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />

                  <div className="space-y-8">
                    {schedule.map((stop, i) => (
                      <div key={i} className="flex gap-4 relative">
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                          i === 0 ? "border-primary bg-primary text-primary-foreground" :
                          i === schedule.length - 1 ? "border-primary bg-card" :
                          "border-status-active bg-card"
                        }`}>
                          {i === 0 && <Navigation2 className="h-3 w-3" />}
                          {i === 1 && <span className="h-2 w-2 rounded-full bg-status-active" />}
                          {i === schedule.length - 1 && <MapPin className="h-3 w-3 text-primary" />}
                        </div>
                        <div className="flex-1 flex items-start justify-between">
                          <div>
                            <span className={`text-xs font-medium ${
                              i === 0 ? "text-primary" : i === 1 ? "text-status-active" : "text-primary"
                            }`}>{stop.label}</span>
                            <p className="font-semibold text-foreground">{stop.location}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-bold ${
                              i === 0 ? "text-foreground" : "text-primary"
                            }`}>{stop.time}</span>
                            <p className="text-[11px] text-muted-foreground">{stop.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {amenities.map((a) => (
                <div key={a.label} className="flex flex-col items-center gap-2 rounded-xl border bg-card py-5 px-3">
                  <span className="text-primary">{a.icon}</span>
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tickets */}
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="bg-primary text-primary-foreground px-5 py-3">
                <h2 className="font-semibold text-sm">Tickets & Accommodations</h2>
              </div>
              <div className="p-4 space-y-2">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t.id)}
                    className={`w-full flex items-center gap-3 rounded-lg p-3 border text-left transition-all ${
                      selectedTicket === t.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className={`${selectedTicket === t.id ? "text-primary" : "text-muted-foreground"}`}>
                      {t.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">{t.label}</p>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{t.tier}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-primary text-sm">{t.price}</span>
                      <p className="text-[10px] text-muted-foreground">{t.priceLabel}</p>
                    </div>
                  </button>
                ))}

                <Button className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2">
                  Reserve Now <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border bg-card overflow-hidden divide-y">
              {[
                { icon: <Printer className="h-4 w-4" />, label: "Print Route Summary" },
                { icon: <Download className="h-4 w-4" />, label: "Download Offline Map" },
                { icon: <FileText className="h-4 w-4" />, label: "Vessel Documentation" },
              ].map((action) => (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RouteDetails;
