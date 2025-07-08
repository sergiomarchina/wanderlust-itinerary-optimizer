import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Map, Calendar, Users, Plus, MapPin, Navigation as NavigationIcon } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PlaceInfoDialog } from "@/components/PlaceInfoDialog";
import { ItineraryItem } from "@/types/itinerary";
import { toast } from "sonner";

interface Place {
  id: number;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  duration: string;
  price: string;
  distance?: number;
}

const places: Place[] = [
  {
    id: 1,
    name: "Torre di Pisa",
    location: "Pisa, Toscana",
    rating: 4.7,
    reviews: 12450,
    image: "🗼",
    category: "Monumento",
    duration: "2-3 ore",
    price: "€18"
  },
  {
    id: 2,
    name: "Cinque Terre",
    location: "Liguria",
    rating: 4.8,
    reviews: 8930,
    image: "🏔️",
    category: "Natura",
    duration: "1 giorno",
    price: "Gratis"
  },
  {
    id: 3,
    name: "Palazzo Pitti",
    location: "Firenze, Toscana",
    rating: 4.6,
    reviews: 5670,
    image: "🏰",
    category: "Museo",
    duration: "3-4 ore",
    price: "€25"
  },
  {
    id: 4,
    name: "Duomo di Siena",
    location: "Siena, Toscana",
    rating: 4.9,
    reviews: 3420,
    image: "⛪",
    category: "Monumento",
    duration: "1-2 ore",
    price: "€12"
  }
];

const categories = [
  { id: "all", name: "Tutti", icon: "🌟" },
  { id: "monument", name: "Monumenti", icon: "🏛️" },
  { id: "museum", name: "Musei", icon: "🎨" },
  { id: "nature", name: "Natura", icon: "🌿" },
  { id: "food", name: "Gastronomia", icon: "🍝" }
];

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<ItineraryItem | null>(null);
  const [showPlaceInfo, setShowPlaceInfo] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>(places);
  const { addItineraryItem, currentTrip } = useItineraryStore();
  const { latitude, longitude, error: geoError, loading: geoLoading } = useGeolocation();

  // Simula il recupero di luoghi basati sulla posizione
  useEffect(() => {
    if (latitude && longitude) {
      // Simula il filtraggio per distanza (in un'app reale faresti una chiamata API)
      const placesWithDistance = places.map(place => ({
        ...place,
        distance: Math.random() * 50 + 1, // Simula distanza in km
      })).sort((a, b) => a.distance - b.distance);
      
      setNearbyPlaces(placesWithDistance);
      toast.success("Luoghi nelle vicinanze aggiornati!");
    }
  }, [latitude, longitude]);

  const addToItinerary = (place: Place) => {
    if (!currentTrip || !currentTrip.days[0]) {
      toast.error("Nessun viaggio attivo trovato");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: place.name,
      time: "14:00", // Default time
      duration: place.duration,
      type: place.category,
      rating: place.rating,
      image: place.image,
      location: {
        lat: 43.7731 + (Math.random() - 0.5) * 0.1, // Coordinate casuali vicine
        lng: 11.2560 + (Math.random() - 0.5) * 0.1,
        address: place.location
      },
      estimatedCost: place.price
    };

    addItineraryItem(currentTrip.days[0].id, newItem);
    toast.success(`${place.name} aggiunto all'itinerario!`);
  };

  const handlePlaceClick = (place: Place) => {
    const itemPlace: ItineraryItem = {
      id: place.id.toString(),
      name: place.name,
      time: "14:00",
      duration: place.duration,
      type: place.category,
      rating: place.rating,
      image: place.image,
      location: {
        lat: 43.7731 + (Math.random() - 0.5) * 0.1,
        lng: 11.2560 + (Math.random() - 0.5) * 0.1,
        address: place.location
      },
      estimatedCost: place.price
    };
    
    setSelectedPlace(itemPlace);
    setShowPlaceInfo(true);
  };

  const filteredPlaces = nearbyPlaces.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || 
                           place.category.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Scopri nuovi luoghi</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">Trova le migliori attrazioni per il tuo viaggio</p>
          {geoLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <NavigationIcon className="h-4 w-4 animate-spin" />
              Rilevamento posizione...
            </div>
          )}
          {latitude && longitude && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <MapPin className="h-4 w-4" />
              Posizione rilevata
            </div>
          )}
          {geoError && (
            <div className="text-sm text-destructive">
              {geoError}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-card-custom border-0">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca destinazioni, città, attrazioni..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="shadow-card-custom border-0">
        <CardContent className="p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "gradient" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Consigliati</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="nearby">Vicino a te</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPlaces.map((place) => (
              <Card key={place.id} className="shadow-card-custom hover:shadow-travel transition-all duration-300 cursor-pointer group border-0" onClick={() => handlePlaceClick(place)}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{place.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {place.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{place.location}</p>
                            {place.distance && (
                              <Badge variant="outline" className="text-xs">
                                {place.distance.toFixed(1)} km
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge variant="secondary">{place.category}</Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-accent fill-current" />
                          <span className="font-medium">{place.rating}</span>
                          <span className="text-muted-foreground">({place.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{place.duration}</span>
                        </div>
                        <div className="font-medium text-primary">{place.price}</div>
                      </div>

                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="gradient" className="flex-1" onClick={() => addToItinerary(place)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Aggiungi all'itinerario
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="mr-2 h-4 w-4" />
                          Salva
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card className="shadow-card-custom border-0">
            <CardHeader>
              <CardTitle>🔥 Luoghi più popolari questa settimana</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Contenuto in sviluppo...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nearby" className="space-y-4">
          <Card className="shadow-card-custom border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📍 Scopri cosa c'è vicino a te
                {geoLoading && <NavigationIcon className="h-4 w-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {geoError ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">{geoError}</p>
                  <p className="text-sm text-muted-foreground">
                    Abilita la geolocalizzazione per vedere i luoghi nelle tue vicinanze
                  </p>
                </div>
              ) : latitude && longitude ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Luoghi ordinati per distanza dalla tua posizione
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nearbyPlaces.slice(0, 6).map((place) => (
                      <Card key={place.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => handlePlaceClick(place)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{place.image}</div>
                            <div className="flex-1">
                              <h4 className="font-medium">{place.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{place.distance?.toFixed(1)} km</span>
                                <span>•</span>
                                <span>{place.rating} ⭐</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <NavigationIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Rilevamento posizione in corso...</p>
                  <p className="text-sm text-muted-foreground">
                    Assicurati di aver abilitato la geolocalizzazione
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <PlaceInfoDialog
        place={selectedPlace}
        isOpen={showPlaceInfo}
        onClose={() => setShowPlaceInfo(false)}
        onNavigate={(place) => {
          if (place.location) {
            const { lat, lng } = place.location;
            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
            window.open(url, '_blank');
            toast.success(`Navigazione avviata verso ${place.name}`);
          }
        }}
      />
    </div>
  );
}