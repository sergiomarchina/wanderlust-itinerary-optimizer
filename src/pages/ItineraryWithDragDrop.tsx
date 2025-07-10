import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, RotateCcw, Share2 } from "lucide-react";
import { DraggableItineraryItem } from "@/components/DraggableItineraryItem";
import { WeatherWidget } from "@/components/WeatherWidget";
import { ExpenseTracker } from "@/components/ExpenseTracker";
import { ItineraryImporter } from "@/components/ItineraryImporter";
import { ItineraryExporter } from "@/components/ItineraryExporter";
import { TripSelector } from "@/components/TripSelector";
import { DaySelector } from "@/components/DaySelector";
import { AIAssistant } from "@/components/AIAssistant";
import { AddItineraryItemForm } from "@/components/AddItineraryItemForm";
import { useTrips, useUpdateItemsOrder } from "@/hooks/useTrips";
import { toast } from "sonner";

export default function Itinerary() {
  const { data: trips, isLoading } = useTrips();
  const updateItemsOrder = useUpdateItemsOrder();
  const [searchTerm, setSearchTerm] = useState("");

  const currentTrip = trips?.[0]; // Use the first trip as current for now
  const [selectedDayId, setSelectedDayId] = useState<string>("");

  useEffect(() => {
    if (currentTrip && !selectedDayId) {
      setSelectedDayId(currentTrip.days[0]?.id || "");
    }
  }, [currentTrip, selectedDayId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Caricamento...</h2>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="text-center py-12 space-y-6">
        <h2 className="text-2xl font-bold mb-4">Nessun viaggio attivo</h2>
        <p className="text-muted-foreground">Importa un itinerario o crea un nuovo viaggio per iniziare!</p>
        <div className="max-w-md mx-auto">
          <ItineraryImporter />
        </div>
      </div>
    );
  }

  const currentDay =
    currentTrip.days.find((d) => d.id === selectedDayId) || currentTrip.days[0];

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = currentDay.items.findIndex((item) => item.id === active.id);
      const newIndex = currentDay.items.findIndex((item) => item.id === over?.id);

      const newItems = arrayMove(currentDay.items, oldIndex, newIndex);
      updateItemsOrder.mutate({ dayId: currentDay.id, items: newItems });

      toast.success("Itinerario riordinato!");
    }
  }

  const handleOptimizeRoute = () => {
    // Simula l'ottimizzazione dell'itinerario
    toast.info("Ottimizzando il percorso...");
    setTimeout(() => {
      toast.success("Percorso ottimizzato! Risparmierai 30 minuti di viaggio.");
    }, 2000);
  };

  const shareItinerary = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTrip?.name || 'Il mio itinerario',
        text: `Guarda il mio itinerario di viaggio: ${currentTrip?.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiato negli appunti!");
    }
  };

  const totalDuration = currentDay.items.reduce((total, item) => {
    const hours = parseInt(item.duration.split(' ')[0]);
    return total + (isNaN(hours) ? 1 : hours);
  }, 0);

  const totalCost = currentDay.items.reduce((total, item) => {
    if (item.estimatedCost && item.estimatedCost !== 'Gratis') {
      const cost = parseInt(item.estimatedCost.replace('€', ''));
      return total + (isNaN(cost) ? 0 : cost);
    }
    return total;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{currentTrip.name}</h1>
          <p className="text-muted-foreground">
            {new Date(currentDay.date).toLocaleDateString('it-IT', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}{" "}
            • Giorno {currentTrip.days.findIndex((d) => d.id === currentDay.id) + 1} di {currentTrip.days.length}
          </p>
        </div>
        <div className="flex gap-3">
          <TripSelector />
          <DaySelector
            days={currentTrip.days}
            selectedDayId={selectedDayId}
            onChange={setSelectedDayId}
          />
          <Button variant="outline" onClick={shareItinerary}>
            <Share2 className="mr-2 h-4 w-4" />
            Condividi
          </Button>
          <ItineraryExporter />
          <AddItineraryItemForm />
          <ItineraryImporter />
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
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
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>Itinerario di oggi</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {currentDay.items.length} tappe
            </Badge>
          </h2>
          <Button variant="outline" size="sm" onClick={handleOptimizeRoute}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Ottimizza percorso
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={currentDay.items} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {currentDay.items.map((item, index) => (
                <DraggableItineraryItem
                  key={item.id}
                  item={item}
                  dayId={currentDay.id}
                  index={index}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {currentDay.items.length === 0 && (
          <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">Nessuna tappa pianificata</h3>
              <p className="text-muted-foreground mb-4">
                Aggiungi la tua prima destinazione per iniziare l'avventura!
              </p>
              <div className="flex flex-col gap-3">
                <ItineraryImporter />
                <AddItineraryItemForm />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <Card className="shadow-card-custom border-0 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Riepilogo giornata</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalDuration}h</div>
              <div className="text-sm text-muted-foreground">Tempo totale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{currentDay.items.length}</div>
              <div className="text-sm text-muted-foreground">Tappe</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">2.5km</div>
              <div className="text-sm text-muted-foreground">Distanza</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">€{totalCost}</div>
              <div className="text-sm text-muted-foreground">Costo stimato</div>
            </div>
          </div>
        </CardContent>
        </Card>
        </div>

        {/* Weather and Expenses Sidebar */}
        <div className="space-y-6">
          <WeatherWidget />
          <ExpenseTracker />
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
}