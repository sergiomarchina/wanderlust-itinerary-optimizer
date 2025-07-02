import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Map, Star, Navigation as NavigationIcon, Plus, Search } from "lucide-react";

const sampleItinerary = [
  {
    id: 1,
    name: "Duomo di Firenze",
    time: "09:00",
    duration: "2 ore",
    type: "Monumento",
    rating: 4.8,
    image: "🏛️"
  },
  {
    id: 2,
    name: "Ponte Vecchio",
    time: "11:30",
    duration: "1 ora",
    type: "Attrazione",
    rating: 4.6,
    image: "🌉"
  },
  {
    id: 3,
    name: "Uffizi Gallery",
    time: "14:00",
    duration: "3 ore",
    type: "Museo",
    rating: 4.9,
    image: "🎨"
  }
];

export default function Itinerary() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tour della Toscana</h1>
          <p className="text-muted-foreground">15 Luglio 2024 • Giorno 1 di 7</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Cambia data
          </Button>
          <Button variant="gradient">
            <Plus className="mr-2 h-4 w-4" />
            Aggiungi tappa
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-card-custom border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca luoghi da visitare..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Itinerario di oggi</h2>
          <Button variant="outline" size="sm">
            <NavigationIcon className="mr-2 h-4 w-4" />
            Ottimizza percorso
          </Button>
        </div>

        <div className="space-y-4">
          {sampleItinerary.map((item, index) => (
            <Card key={item.id} className="shadow-card-custom hover:shadow-travel transition-all duration-300 border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-semibold shadow-travel">
                      {item.time}
                    </div>
                    {index < sampleItinerary.length - 1 && (
                      <div className="w-0.5 h-16 bg-border mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <span className="text-2xl">{item.image}</span>
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <Badge variant="secondary">{item.type}</Badge>
                          <span className="text-sm text-muted-foreground">{item.duration}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-accent fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="gradient">
                        <NavigationIcon className="mr-2 h-4 w-4" />
                        Naviga
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="mr-2 h-4 w-4" />
                        Salva
                      </Button>
                      <Button size="sm" variant="ghost">
                        Dettagli
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="shadow-card-custom border-0">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Riepilogo giornata</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6h</div>
              <div className="text-sm text-muted-foreground">Tempo totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">3</div>
              <div className="text-sm text-muted-foreground">Tappe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">2.5km</div>
              <div className="text-sm text-muted-foreground">Distanza</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">15€</div>
              <div className="text-sm text-muted-foreground">Costo stimato</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}