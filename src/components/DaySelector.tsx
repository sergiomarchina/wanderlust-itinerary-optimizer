import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TravelDay } from "@/types/itinerary";

interface DaySelectorProps {
  days: TravelDay[];
  selectedDayId: string;
  onChange: (dayId: string) => void;
}

export function DaySelector({ days, selectedDayId, onChange }: DaySelectorProps) {
  return (
    <Select value={selectedDayId} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleziona giorno" />
      </SelectTrigger>
      <SelectContent>
        {days.map((day, idx) => (
          <SelectItem key={day.id} value={day.id}>
            {`Giorno ${idx + 1} - ${new Date(day.date).toLocaleDateString('it-IT')}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
