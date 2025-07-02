import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map, Calendar, Plane, Star, Navigation as NavigationIcon, Users } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";

export function Dashboard() {
  const navigate = useNavigate();
  const { currentTrip } = useItineraryStore();

  const handleContinueTrip = () => {
    navigate('/itinerary');
  };

  const handleNewItinerary = () => {
    navigate('/itinerary');
  };

  const handleDiscover = () => {
    navigate('/discover');
  };
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 text-white shadow-glow backdrop-blur-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Benvenuto in TravelMate</h1>
          <p className="text-white/90 mb-6">Il tuo assistente di viaggio intelligente</p>
          <Button variant="hero" size="lg" className="bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm" onClick={handleNewItinerary}>
            <NavigationIcon className="mr-2 h-5 w-5" />
            Inizia nuovo viaggio
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-15">
          <div className="w-full h-full bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Current Trip */}
      <Card className="shadow-card-custom hover:shadow-travel transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              Viaggio Corrente
            </CardTitle>
            <Badge variant="secondary" className="bg-secondary/20 text-secondary font-semibold">
              In corso
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{currentTrip?.name || 'Tour della Toscana'}</h3>
              <p className="text-muted-foreground">15-22 Luglio 2024 • 7 giorni</p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                <span>{currentTrip?.days[0]?.items.length || 5} città</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                <span>12 attrazioni</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>2 persone</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="gradient" className="flex-1" onClick={handleContinueTrip}>
                <NavigationIcon className="mr-2 h-4 w-4" />
                Continua
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate('/itinerary')}>
                <Calendar className="mr-2 h-4 w-4" />
                Modifica
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-card-custom hover:shadow-travel transition-all duration-300 cursor-pointer group border-0 bg-card/60 backdrop-blur-sm" onClick={handleNewItinerary}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-adventure rounded-xl shadow-travel group-hover:shadow-glow transition-all duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Nuovo Itinerario</h3>
                <p className="text-sm text-muted-foreground">Pianifica la tua prossima avventura</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card-custom hover:shadow-travel transition-all duration-300 cursor-pointer group border-0 bg-card/60 backdrop-blur-sm" onClick={handleDiscover}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-gradient-sunset rounded-xl shadow-travel group-hover:shadow-glow transition-all duration-300">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Scopri</h3>
                <p className="text-sm text-muted-foreground">Trova nuovi luoghi incredibili</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Attività Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: Star, text: "Hai salvato 'Duomo di Firenze' nei preferiti", time: "2 ore fa" },
              { icon: Plane, text: "Volo FR1234 confermato per il 15 Luglio", time: "1 giorno fa" },
              { icon: Map, text: "Itinerario 'Roma Antica' completato", time: "3 giorni fa" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-2 bg-muted rounded-lg">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}