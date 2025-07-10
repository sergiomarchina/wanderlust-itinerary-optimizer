import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItineraryItem } from "@/types/itinerary";
import { useItineraryStore } from "@/store/itineraryStore";
import { toast } from "sonner";

interface EditItineraryItemFormProps {
  item: ItineraryItem;
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
}

export function EditItineraryItemForm({ item, isOpen, onClose, dayId }: EditItineraryItemFormProps) {
  const [formData, setFormData] = useState({
    name: item.name,
    time: item.time,
    duration: item.duration,
    type: item.type,
    address: item.location.address,
    estimatedCost: item.estimatedCost || "€0",
    notes: item.notes || ""
  });
  const [selectedDayId, setSelectedDayId] = useState(dayId);

  const { currentTrip, updateItineraryItem, addItineraryItem, removeItineraryItem } = useItineraryStore();

  useEffect(() => {
    if (isOpen) {
      setSelectedDayId(dayId);
    }
  }, [isOpen, dayId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates = {
      name: formData.name,
      time: formData.time,
      duration: formData.duration,
      type: formData.type,
      location: {
        ...item.location,
        address: formData.address
      },
      estimatedCost: formData.estimatedCost,
      notes: formData.notes,
      image: getEmojiForType(formData.type)
    };

    const updatedItem = { ...item, ...updates };

    if (selectedDayId !== dayId) {
      removeItineraryItem(dayId, item.id);
      addItineraryItem(selectedDayId, updatedItem);
    } else {
      updateItineraryItem(dayId, item.id, updates);
    }

    toast.success(`${formData.name} aggiornato!`);
    onClose();
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
    return typeEmojis[type] || item.image;
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica Tappa</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome del luogo</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-day">Giorno</Label>
            <Select value={selectedDayId} onValueChange={setSelectedDayId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentTrip?.days.map((day, idx) => (
                  <SelectItem key={day.id} value={day.id}>
                    {`Giorno ${idx + 1} - ${new Date(day.date).toLocaleDateString('it-IT')}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="edit-time">Orario</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData({ ...formData, time: value })}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="edit-duration">Durata</Label>
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
            <Label htmlFor="edit-type">Tipo</Label>
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
            <Label htmlFor="edit-address">Indirizzo</Label>
            <Input
              id="edit-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-cost">Costo stimato</Label>
            <Input
              id="edit-cost"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Note</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annulla
            </Button>
            <Button type="submit" variant="gradient" className="flex-1">
              Salva Modifiche
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}