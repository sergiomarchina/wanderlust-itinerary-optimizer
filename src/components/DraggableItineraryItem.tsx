import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItineraryItem } from "@/types/itinerary";
import { Star, Navigation as NavigationIcon, Trash2, GripVertical } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { toast } from "sonner";

interface DraggableItineraryItemProps {
  item: ItineraryItem;
  dayId: string;
  index: number;
}

export function DraggableItineraryItem({ item, dayId, index }: DraggableItineraryItemProps) {
  const { removeItineraryItem } = useItineraryStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = () => {
    removeItineraryItem(dayId, item.id);
    toast.success(`${item.name} rimosso dall'itinerario`);
  };

  const handleNavigate = () => {
    toast.info(`Navigando verso ${item.name}...`);
    // Qui integreresti la navigazione reale
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 scale-105 rotate-2' : ''} transition-all duration-200`}
    >
      <Card className={`shadow-card-custom hover:shadow-travel transition-all duration-300 border-0 bg-card/60 backdrop-blur-sm ${isDragging ? 'shadow-glow' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Drag Handle */}
            <div
              {...attributes}
              {...listeners}
              className="flex flex-col items-center cursor-grab active:cursor-grabbing"
            >
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white font-semibold shadow-travel">
                {item.time}
              </div>
              <GripVertical className="h-4 w-4 text-muted-foreground mt-2 opacity-60" />
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
                    {item.estimatedCost && (
                      <span className="text-sm font-medium text-primary">{item.estimatedCost}</span>
                    )}
                  </div>
                </div>
              </div>

              {item.location && (
                <p className="text-sm text-muted-foreground mb-3">
                  📍 {item.location.address}
                </p>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="gradient" onClick={handleNavigate}>
                  <NavigationIcon className="mr-2 h-4 w-4" />
                  Naviga
                </Button>
                <Button size="sm" variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  Salva
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRemove}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Rimuovi
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}