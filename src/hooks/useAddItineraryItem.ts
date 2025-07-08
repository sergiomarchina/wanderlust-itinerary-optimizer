import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ItineraryItem } from '@/types/itinerary';

export const useAddItineraryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ dayId, item }: { dayId: string, item: ItineraryItem }) => {
      const storedTrips = JSON.parse(localStorage.getItem('travel-trips') || '[]');
      const updatedTrips = storedTrips.map((trip: any) => ({
        ...trip,
        days: trip.days.map((day: any) => 
          day.id === dayId 
            ? { ...day, items: [...day.items, item] }
            : day
        )
      }));
      localStorage.setItem('travel-trips', JSON.stringify(updatedTrips));
      return updatedTrips;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });
};