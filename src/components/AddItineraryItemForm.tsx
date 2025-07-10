import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useTrips } from "@/hooks/useTrips";
import { useAddItineraryItem } from "@/hooks/useAddItineraryItem";
import { Trip } from "@/types/itinerary";
import { toast } from "sonner";

interface AddItemFormData {
  name: string;
  time: string;
  duration: string;
  type: string;
  address: string;
  estimatedCost: string;
  notes: string;
}

export function AddItineraryItemForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<AddItemFormData>({
    name: "",
    time: "",
    duration: "2 ore",
    type: "Attrazione",
    address: "",
    estimatedCost: "€0",
    notes: ""
  });
  const { data: trips } = useTrips();
  const addItem = useAddItineraryItem();
  const queryClient = useQueryClient();
  const currentTrip = trips?.[0]; // Use the first trip as current
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const leastBusyDay = currentTrip && currentTrip.days.length > 0
    ? currentTrip.days.reduce((prev, curr) =>
        curr.items.length < prev.items.length ? curr : prev
      )
    : undefined;

  useEffect(() => {
    if (isOpen) {
      setSelectedDate(leastBusyDay ? new Date(leastBusyDay.date) : undefined);
    }
  }, [isOpen, leastBusyDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentTrip || !selectedDate) {
      toast.error("Nessun viaggio attivo trovato");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Il nome del luogo è obbligatorio");
      return;
    }

    const dateString = selectedDate.toISOString().split('T')[0];
    let targetDay = currentTrip.days.find((d) => d.date === dateString);
    let targetDayId = targetDay?.id;

    if (!targetDay) {
      targetDayId = `day-${Date.now()}`;
      targetDay = { id: targetDayId, date: dateString, items: [] };

      const storedTrips: Trip[] = JSON.parse(localStorage.getItem('travel-trips') || '[]');
      const updatedTrips = storedTrips.map((trip: Trip) =>
        trip.id === currentTrip.id
          ? { ...trip, days: [...trip.days, targetDay] }
          : trip
      );
      localStorage.setItem('travel-trips', JSON.stringify(updatedTrips));
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }

    const getNextAvailableTime = () => {
      if (!targetDay) return "09:00";
      const hour = 9 + targetDay.items.length * 2;
      const adjusted = hour % 24;
      return `${adjusted.toString().padStart(2, "0")}:00`;
    };

    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      time: formData.time || getNextAvailableTime(),
      duration: formData.duration,
      type: formData.type,
      rating: 4.0,
      image: getEmojiForType(formData.type),
      location: {
        lat: 43.7731 + (Math.random() - 0.5) * 0.1,
        lng: 11.2560 + (Math.random() - 0.5) * 0.1,
        address: formData.address || "Indirizzo da specificare"
      },
      estimatedCost: formData.estimatedCost,
      notes: formData.notes
    };

    // Add the item using React Query mutation
    addItem.mutate({
      dayId: targetDayId!,
      item: newItem
    }, {
      onSuccess: () => {
        toast.success(`${formData.name} aggiunto all'itinerario!`);
        
        // Reset form
        setFormData({
          name: "",
          time: "",
          duration: "2 ore",
          type: "Attrazione",
          address: "",
          estimatedCost: "€0",
          notes: ""
        });
        setSelectedDate(undefined);

        setIsOpen(false);
      },
      onError: () => {
        toast.error("Errore nell'aggiungere la tappa");
      }
    });
  };

  const getEmojiForType = (type: string): string => {
    const typeEmojis: { [key: string]: string } = {
      "Attrazione": "🎯",
      "Ristorante": "🍽️",
      "Hotel": "🏨",
      "Museo": "🎨",
      "Monumento": "🏛️",
      "Natura": "🌿",
      "Shopping": "🛍️",
      "Trasporto": "🚗",
      "Altro": "📍"
    };
    return typeEmojis[type] || "📍";
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="gradient" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Tappa Manuale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Aggiungi Nuova Tappa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome del luogo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Es. Duomo di Milano"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? new Date(selectedDate).toLocaleDateString('it-IT')
                    : <span>Seleziona data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="time">Orario</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona orario" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Durata</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 min">30 minuti</SelectItem>
                  <SelectItem value="1 ora">1 ora</SelectItem>
                  <SelectItem value="2 ore">2 ore</SelectItem>
                  <SelectItem value="3 ore">3 ore</SelectItem>
                  <SelectItem value="4 ore">4 ore</SelectItem>
                  <SelectItem value="Mezza giornata">Mezza giornata</SelectItem>
                  <SelectItem value="Giornata intera">Giornata intera</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Attrazione">🎯 Attrazione</SelectItem>
                <SelectItem value="Ristorante">🍽️ Ristorante</SelectItem>
                <SelectItem value="Hotel">🏨 Hotel</SelectItem>
                <SelectItem value="Museo">🎨 Museo</SelectItem>
                <SelectItem value="Monumento">🏛️ Monumento</SelectItem>
                <SelectItem value="Natura">🌿 Natura</SelectItem>
                <SelectItem value="Shopping">🛍️ Shopping</SelectItem>
                <SelectItem value="Trasporto">🚗 Trasporto</SelectItem>
                <SelectItem value="Altro">📍 Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Indirizzo</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Es. Piazza del Duomo, Milano"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Costo stimato</Label>
            <Input
              id="cost"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              placeholder="Es. €15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Aggiungi note o promemoria..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Annulla
            </Button>
            <Button type="submit" variant="gradient" className="flex-1" disabled={addItem.isPending}>
              {addItem.isPending ? "Aggiungendo..." : "Aggiungi Tappa"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}