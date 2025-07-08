import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Trip, TravelDay, ItineraryItem } from '@/types/itinerary';
import { toast } from 'sonner';

// Fetch user's trips
export const useTrips = () => {
  return useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      // Temporarily load from localStorage until DB is ready
      const storedTrips = localStorage.getItem('travel-trips');
      if (storedTrips) {
        return JSON.parse(storedTrips) as Trip[];
      }
      return [] as Trip[];
    }
  });
};

// Create a new trip (temporarily using local storage until DB is ready)
export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (trip: Omit<Trip, 'id'>) => {
      // For now, just store locally and show success
      // Will be connected to actual database later
      const tripWithId = {
        ...trip,
        id: Date.now().toString()
      };
      
      // Store in localStorage temporarily
      const existingTrips = JSON.parse(localStorage.getItem('travel-trips') || '[]');
      localStorage.setItem('travel-trips', JSON.stringify([...existingTrips, tripWithId]));
      
      return tripWithId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Viaggio creato con successo!');
    },
    onError: (error) => {
      toast.error('Errore nella creazione del viaggio: ' + error.message);
    }
  });
};

// Update trip items order
export const useUpdateItemsOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ dayId, items }: { dayId: string, items: ItineraryItem[] }) => {
      const storedTrips = JSON.parse(localStorage.getItem('travel-trips') || '[]') as Trip[];
      const updatedTrips = storedTrips.map(trip => ({
        ...trip,
        days: trip.days.map(day => 
          day.id === dayId ? { ...day, items } : day
        )
      }));
      localStorage.setItem('travel-trips', JSON.stringify(updatedTrips));
      return updatedTrips;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Ordine aggiornato!');
    }
  });
};

// Delete itinerary item
export const useDeleteItineraryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const storedTrips = JSON.parse(localStorage.getItem('travel-trips') || '[]') as Trip[];
      const updatedTrips = storedTrips.map(trip => ({
        ...trip,
        days: trip.days.map(day => ({
          ...day,
          items: day.items.filter(item => item.id !== itemId)
        }))
      }));
      localStorage.setItem('travel-trips', JSON.stringify(updatedTrips));
      return updatedTrips;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      toast.success('Elemento rimosso dall\'itinerario');
    }
  });
};