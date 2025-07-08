import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Euro, Camera, Navigation as NavigationIcon, Phone, Globe } from "lucide-react";
import { ItineraryItem } from "@/types/itinerary";

interface PlaceInfoDialogProps {
  place: ItineraryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (place: ItineraryItem) => void;
}

export function PlaceInfoDialog({ place, isOpen, onClose, onNavigate }: PlaceInfoDialogProps) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  if (!place) return null;

  const mockPlaceInfo = {
    description: "Un magnifico esempio di architettura rinascimentale italiana, questo luogo storico offre una vista mozzafiato e un'esperienza culturale unica.",
    openingHours: "09:00 - 18:00",
    phone: "+39 055 123456",
    website: "www.example.com",
    accessibility: "Accessibile ai disabili",
    bestTimeToVisit: "Mattina presto per evitare le folle",
    averageVisitTime: "2-3 ore",
    tips: "Prenota in anticipo online per evitare code",
    nearbyAttractions: ["Palazzo Pitti", "Giardino di Boboli", "Ponte Vecchio"]
  };

  const handleNavigate = () => {
    if (onNavigate && place) {
      onNavigate(place);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{place.image}</span>
            <div>
              <h2 className="text-xl font-bold">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{place.type}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-accent fill-current" />
                  <span className="text-sm font-medium">{place.rating}</span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location */}
          {place.location && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p className="font-medium">Indirizzo</p>
                <p className="text-sm text-muted-foreground">{place.location.address}</p>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Durata</p>
                <p className="text-sm text-muted-foreground">{place.duration}</p>
              </div>
            </div>
            {place.estimatedCost && (
              <div className="flex items-center gap-2">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Costo</p>
                  <p className="text-sm text-muted-foreground">{place.estimatedCost}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Descrizione</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {mockPlaceInfo.description}
            </p>
          </div>

          {/* Additional Info */}
          {showMoreInfo && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Orari di apertura
                  </h4>
                  <p className="text-sm text-muted-foreground">{mockPlaceInfo.openingHours}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contatti
                  </h4>
                  <p className="text-sm text-muted-foreground">{mockPlaceInfo.phone}</p>
                  <p className="text-sm text-muted-foreground">{mockPlaceInfo.website}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">💡 Consigli utili</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {mockPlaceInfo.tips}</li>
                  <li>• {mockPlaceInfo.bestTimeToVisit}</li>
                  <li>• {mockPlaceInfo.accessibility}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">🏛️ Attrazioni nelle vicinanze</h4>
                <div className="flex flex-wrap gap-2">
                  {mockPlaceInfo.nearbyAttractions.map((attraction, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {attraction}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleNavigate}
            >
              <NavigationIcon className="mr-2 h-4 w-4" />
              Naviga
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMoreInfo(!showMoreInfo)}
            >
              {showMoreInfo ? "Meno info" : "Più info"}
            </Button>
            <Button variant="outline" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}