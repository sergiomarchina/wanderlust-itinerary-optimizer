import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useItineraryStore } from "@/store/itineraryStore";
import { toast } from "sonner";

export function ItineraryExporter() {
  const { currentTrip } = useItineraryStore();

  const exportJson = () => {
    if (!currentTrip) {
      toast.error("Nessun viaggio da esportare");
      return;
    }

    const dataStr = JSON.stringify(currentTrip, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    const fileName = `${currentTrip.name.replace(/\s+/g, "_").toLowerCase()}.json`;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Itinerario esportato in JSON");
  };

  return (
    <Button variant="outline" onClick={exportJson} className="flex items-center">
      <Download className="mr-2 h-4 w-4" />
      Esporta JSON
    </Button>
  );
}
