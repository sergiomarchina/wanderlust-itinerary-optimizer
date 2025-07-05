import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { ItineraryItem, TravelDay, Trip } from "@/types/itinerary";
import { toast } from "sonner";

interface ImportStatus {
  isImporting: boolean;
  progress: number;
  message: string;
  success?: boolean;
  error?: string;
}

export function ItineraryImporter() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    isImporting: false,
    progress: 0,
    message: ""
  });
  const { addTrip, setCurrentTrip } = useItineraryStore();

  const parseJsonItinerary = (content: string): Trip | null => {
    try {
      const data = JSON.parse(content);
      
      // Check if it's already in our format
      if (data.id && data.name && data.days) {
        return data as Trip;
      }
      
      // Try to convert from other formats
      if (data.itinerary || data.places || data.destinations) {
        const places = data.itinerary || data.places || data.destinations;
        const items: ItineraryItem[] = places.map((place: any, index: number) => ({
          id: `imported-${index}`,
          name: place.name || place.title || place.destination || "Luogo sconosciuto",
          time: place.time || `${9 + index}:00`,
          duration: place.duration || "2 ore",
          type: place.type || place.category || "Attrazione",
          rating: place.rating || 4.0,
          image: place.emoji || place.icon || "📍",
          location: {
            lat: place.lat || place.latitude || 0,
            lng: place.lng || place.longitude || 0,
            address: place.address || place.location || "Indirizzo non specificato"
          },
          estimatedCost: place.cost || place.price || "€0"
        }));

        return {
          id: Date.now().toString(),
          name: data.name || data.title || "Itinerario Importato",
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          endDate: data.endDate || new Date().toISOString().split('T')[0],
          participants: data.participants || 1,
          status: 'planning',
          days: [{
            id: `day-${Date.now()}`,
            date: data.startDate || new Date().toISOString().split('T')[0],
            items
          }]
        };
      }
      
      return null;
    } catch {
      return null;
    }
  };

  const parseCsvItinerary = (content: string): Trip | null => {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      if (lines.length < 2) return null;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const items: ItineraryItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const item: ItineraryItem = {
          id: `csv-${i}`,
          name: values[headers.indexOf('name')] || values[0] || `Luogo ${i}`,
          time: values[headers.indexOf('time')] || `${8 + i}:00`,
          duration: values[headers.indexOf('duration')] || "2 ore",
          type: values[headers.indexOf('type')] || "Attrazione",
          rating: parseFloat(values[headers.indexOf('rating')]) || 4.0,
          image: values[headers.indexOf('emoji')] || "📍",
          location: {
            lat: parseFloat(values[headers.indexOf('lat')]) || 0,
            lng: parseFloat(values[headers.indexOf('lng')]) || 0,
            address: values[headers.indexOf('address')] || "Indirizzo non specificato"
          },
          estimatedCost: values[headers.indexOf('cost')] || "€0"
        };
        items.push(item);
      }

      return {
        id: Date.now().toString(),
        name: "Itinerario CSV Importato",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        participants: 1,
        status: 'planning',
        days: [{
          id: `day-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          items
        }]
      };
    } catch {
      return null;
    }
  };

  const parseTextItinerary = (content: string): Trip | null => {
    try {
      const lines = content.split('\n').filter(line => line.trim());
      const items: ItineraryItem[] = [];

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.toLowerCase().includes('itinerario')) {
          // Try to parse time if present
          const timeMatch = trimmed.match(/(\d{1,2}:\d{2})/);
          const time = timeMatch ? timeMatch[1] : `${9 + index}:00`;
          
          // Remove time from name if found
          const name = trimmed.replace(/^\d{1,2}:\d{2}\s*-?\s*/, '').trim() || `Tappa ${index + 1}`;
          
          items.push({
            id: `text-${index}`,
            name,
            time,
            duration: "2 ore",
            type: "Attrazione",
            rating: 4.0,
            image: "📍",
            location: {
              lat: 0,
              lng: 0,
              address: "Da specificare"
            },
            estimatedCost: "€0"
          });
        }
      });

      if (items.length === 0) return null;

      return {
        id: Date.now().toString(),
        name: "Itinerario di Testo Importato",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        participants: 1,
        status: 'planning',
        days: [{
          id: `day-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          items
        }]
      };
    } catch {
      return null;
    }
  };

  const processFile = async (file: File) => {
    setImportStatus({ isImporting: true, progress: 20, message: "Lettura file..." });
    
    try {
      const content = await file.text();
      setImportStatus({ isImporting: true, progress: 50, message: "Analisi contenuto..." });
      
      let trip: Trip | null = null;
      
      if (file.name.endsWith('.json') || file.type === 'application/json') {
        trip = parseJsonItinerary(content);
      } else if (file.name.endsWith('.csv') || file.type === 'text/csv') {
        trip = parseCsvItinerary(content);
      } else {
        trip = parseTextItinerary(content);
      }
      
      setImportStatus({ isImporting: true, progress: 80, message: "Importazione..." });
      
      if (trip) {
        addTrip(trip);
        setCurrentTrip(trip);
        setImportStatus({ 
          isImporting: false, 
          progress: 100, 
          message: "Importazione completata!", 
          success: true 
        });
        toast.success(`Itinerario "${trip.name}" importato con successo!`);
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        setImportStatus({ 
          isImporting: false, 
          progress: 0, 
          message: "", 
          error: "Formato file non riconosciuto" 
        });
        toast.error("Impossibile importare il file. Verifica il formato.");
      }
    } catch (error) {
      setImportStatus({ 
        isImporting: false, 
        progress: 0, 
        message: "", 
        error: "Errore durante l'importazione" 
      });
      toast.error("Errore durante l'importazione del file");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          Importa Itinerario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Importa Itinerario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
              ${isDragOver 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted hover:border-primary/50 hover:bg-muted/20'
              }
            `}
          >
            <div className="space-y-4">
              <div className={`transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  {isDragOver ? "Rilascia il file qui!" : "Trascina il file qui"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supporta JSON, CSV e file di testo
                </p>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".json,.csv,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input">
                    <Button variant="outline" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      Seleziona File
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Import Status */}
          {importStatus.isImporting && (
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 animate-bounce" />
                    <span className="text-sm font-medium">{importStatus.message}</span>
                  </div>
                  <Progress value={importStatus.progress} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success Message */}
          {importStatus.success && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">{importStatus.message}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {importStatus.error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{importStatus.error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format Examples */}
          <Card className="bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Formati supportati:</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <div><strong>JSON:</strong> {"{"}"name": "Roma", "time": "09:00", "type": "Museo"{"}"}</div>
              <div><strong>CSV:</strong> name,time,type,address</div>
              <div><strong>Testo:</strong> 09:00 - Colosseo</div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}