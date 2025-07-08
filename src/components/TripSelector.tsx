import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, MapPin, Users, Plus, Calendar } from "lucide-react";
import { useTrips, useCreateTrip } from "@/hooks/useTrips";
import { useItineraryStore } from "@/store/itineraryStore";
import { Trip } from "@/types/itinerary";
import { toast } from "sonner";

export function TripSelector() {
  const { data: trips, isLoading } = useTrips();
  const createTrip = useCreateTrip();
  const { currentTrip, setCurrentTrip } = useItineraryStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    participants: 2,
    destination: ''
  });

  const handleSelectTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsOpen(false);
    toast.success(`Viaggio "${trip.name}" selezionato!`);
  };

  const handleCreateTrip = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    const newTrip: Omit<Trip, 'id'> = {
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      participants: formData.participants,
      status: 'planning' as const,
      days: [
        {
          id: `day-${Date.now()}`,
          date: formData.startDate,
          items: []
        }
      ]
    };

    createTrip.mutate(newTrip, {
      onSuccess: (trip) => {
        setCurrentTrip(trip);
        setIsCreateDialogOpen(false);
        setIsOpen(false);
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          participants: 2,
          destination: ''
        });
      }
    });
  };

  if (isLoading) {
    return <div>Caricamento viaggi...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarDays className="mr-2 h-4 w-4" />
          {currentTrip ? `${currentTrip.name}` : "Seleziona viaggio"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            I tuoi viaggi
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Nuovo viaggio
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea nuovo viaggio</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome del viaggio *</Label>
                    <Input
                      id="name"
                      placeholder="Es. Tour della Toscana"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Data inizio *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Data fine *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="participants">Numero partecipanti</Label>
                    <Input
                      id="participants"
                      type="number"
                      min="1"
                      value={formData.participants}
                      onChange={(e) => setFormData(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="destination">Destinazione principale</Label>
                    <Input
                      id="destination"
                      placeholder="Es. Firenze, Italia"
                      value={formData.destination}
                      onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateTrip} 
                    className="w-full" 
                    variant="gradient"
                    disabled={createTrip.isPending}
                  >
                    {createTrip.isPending ? "Creazione..." : "Crea viaggio"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {trips && trips.length > 0 ? (
            trips.map((trip) => (
              <Card 
                key={trip.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-travel ${
                  currentTrip?.id === trip.id ? 'border-primary shadow-glow' : ''
                }`}
                onClick={() => handleSelectTrip(trip)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trip.name}</CardTitle>
                    <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                      {trip.status === 'active' ? 'In corso' : 'Pianificazione'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString('it-IT')} - {new Date(trip.endDate).toLocaleDateString('it-IT')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{trip.participants} persone</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.days.length} giorni • {trip.days.reduce((total, day) => total + day.items.length, 0)} tappe</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nessun viaggio trovato</p>
              <Button variant="gradient" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crea il tuo primo viaggio
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}