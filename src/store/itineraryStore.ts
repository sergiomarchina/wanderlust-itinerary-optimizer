import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItineraryItem, TravelDay, Trip } from '@/types/itinerary';

interface ItineraryStore {
  currentTrip: Trip | null;
  trips: Trip[];
  
  // Actions
  setCurrentTrip: (trip: Trip) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
  reorderItineraryItems: (dayId: string, items: ItineraryItem[]) => void;
  addItineraryItem: (dayId: string, item: ItineraryItem) => void;
  removeItineraryItem: (dayId: string, itemId: string) => void;
  updateItineraryItem: (dayId: string, itemId: string, updates: Partial<ItineraryItem>) => void;
}

// Sample data
const sampleTrip: Trip = {
  id: '1',
  name: 'Tour della Toscana',
  startDate: '2024-07-15',
  endDate: '2024-07-22',
  participants: 2,
  status: 'active',
  days: [
    {
      id: 'day-1',
      date: '2024-07-15',
      items: [
        {
          id: '1',
          name: 'Duomo di Firenze',
          time: '09:00',
          duration: '2 ore',
          type: 'Monumento',
          rating: 4.8,
          image: '🏛️',
          location: {
            lat: 43.7731,
            lng: 11.2560,
            address: 'Piazza del Duomo, Firenze'
          },
          estimatedCost: '€15'
        },
        {
          id: '2',
          name: 'Ponte Vecchio',
          time: '11:30',
          duration: '1 ora',
          type: 'Attrazione',
          rating: 4.6,
          image: '🌉',
          location: {
            lat: 43.7680,
            lng: 11.2530,
            address: 'Ponte Vecchio, Firenze'
          },
          estimatedCost: 'Gratis'
        },
        {
          id: '3',
          name: 'Uffizi Gallery',
          time: '14:00',
          duration: '3 ore',
          type: 'Museo',
          rating: 4.9,
          image: '🎨',
          location: {
            lat: 43.7677,
            lng: 11.2555,
            address: 'Piazzale degli Uffizi, Firenze'
          },
          estimatedCost: '€25'
        }
      ]
    }
  ]
};

export const useItineraryStore = create<ItineraryStore>()(
  persist(
    (set, get) => ({
      currentTrip: sampleTrip,
      trips: [sampleTrip],

      setCurrentTrip: (trip) => set({ currentTrip: trip }),

      addTrip: (trip) => set((state) => ({
        trips: [...state.trips, trip],
        currentTrip: trip
      })),

      updateTrip: (tripId, updates) => set((state) => {
        const updatedTrips = state.trips.map(trip =>
          trip.id === tripId ? { ...trip, ...updates } : trip
        );
        const updatedCurrentTrip = state.currentTrip?.id === tripId
          ? { ...state.currentTrip, ...updates }
          : state.currentTrip;

        return {
          trips: updatedTrips,
          currentTrip: updatedCurrentTrip
        };
      }),

      reorderItineraryItems: (dayId, items) => set((state) => {
        if (!state.currentTrip) return state;

        const updatedDays = state.currentTrip.days.map(day =>
          day.id === dayId ? { ...day, items } : day
        );

        const updatedTrip = { ...state.currentTrip, days: updatedDays };

        return {
          currentTrip: updatedTrip,
          trips: state.trips.map(trip =>
            trip.id === updatedTrip.id ? updatedTrip : trip
          )
        };
      }),

      addItineraryItem: (dayId, item) => set((state) => {
        if (!state.currentTrip) return state;

        const updatedDays = state.currentTrip.days.map(day =>
          day.id === dayId 
            ? { ...day, items: [...day.items, item] }
            : day
        );

        const updatedTrip = { ...state.currentTrip, days: updatedDays };

        return {
          currentTrip: updatedTrip,
          trips: state.trips.map(trip =>
            trip.id === updatedTrip.id ? updatedTrip : trip
          )
        };
      }),

      removeItineraryItem: (dayId, itemId) => set((state) => {
        if (!state.currentTrip) return state;

        const updatedDays = state.currentTrip.days.map(day =>
          day.id === dayId 
            ? { ...day, items: day.items.filter(item => item.id !== itemId) }
            : day
        );

        const updatedTrip = { ...state.currentTrip, days: updatedDays };

        return {
          currentTrip: updatedTrip,
          trips: state.trips.map(trip =>
            trip.id === updatedTrip.id ? updatedTrip : trip
          )
        };
      }),

      updateItineraryItem: (dayId, itemId, updates) => set((state) => {
        if (!state.currentTrip) return state;

        const updatedDays = state.currentTrip.days.map(day =>
          day.id === dayId 
            ? {
                ...day,
                items: day.items.map(item =>
                  item.id === itemId ? { ...item, ...updates } : item
                )
              }
            : day
        );

        const updatedTrip = { ...state.currentTrip, days: updatedDays };

        return {
          currentTrip: updatedTrip,
          trips: state.trips.map(trip =>
            trip.id === updatedTrip.id ? updatedTrip : trip
          )
        };
      }),
    }),
    {
      name: 'itinerary-store'
    }
  )
);