import { useState } from 'react';
import { toast } from 'sonner';

interface GooglePlace {
  id: string;
  name: string;
  address: string;
  rating: number;
  types: string[];
  location: {
    lat: number;
    lng: number;
  };
  photos?: string[];
  opening_hours?: {
    open_now: boolean;
    periods: any[];
  };
  price_level?: number;
  reviews?: any[];
}

interface SearchParams {
  query?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  type?: string;
}

export const useGoogleMaps = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<GooglePlace[]>([]);

  const searchNearbyPlaces = async (params: SearchParams): Promise<GooglePlace[]> => {
    setIsLoading(true);
    
    try {
      // Simulated Google Places API call - in production this would be a real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPlaces: GooglePlace[] = [
        {
          id: '1',
          name: 'Duomo di Milano',
          address: 'Piazza del Duomo, Milano, MI',
          rating: 4.6,
          types: ['church', 'tourist_attraction', 'place_of_worship'],
          location: { lat: 45.4641, lng: 9.1919 },
          photos: ['duomo1.jpg'],
          opening_hours: { open_now: true, periods: [] },
          price_level: 0
        },
        {
          id: '2',
          name: 'Castello Sforzesco',
          address: 'Piazza Castello, Milano, MI',
          rating: 4.4,
          types: ['museum', 'tourist_attraction', 'establishment'],
          location: { lat: 45.4707, lng: 9.1794 },
          photos: ['castello1.jpg'],
          opening_hours: { open_now: true, periods: [] },
          price_level: 1
        },
        {
          id: '3',
          name: 'Teatro alla Scala',
          address: 'Via Filodrammatici, 2, Milano, MI',
          rating: 4.7,
          types: ['performing_arts_theater', 'tourist_attraction'],
          location: { lat: 45.4671, lng: 9.1896 },
          photos: ['scala1.jpg'],
          opening_hours: { open_now: false, periods: [] },
          price_level: 3
        },
        {
          id: '4',
          name: 'Navigli',
          address: 'Navigli, Milano, MI',
          rating: 4.3,
          types: ['tourist_attraction', 'neighborhood'],
          location: { lat: 45.4483, lng: 9.1732 },
          photos: ['navigli1.jpg'],
          opening_hours: { open_now: true, periods: [] },
          price_level: 2
        },
        {
          id: '5',
          name: 'Parco Sempione',
          address: 'Piazza Sempione, Milano, MI',
          rating: 4.5,
          types: ['park', 'tourist_attraction'],
          location: { lat: 45.4728, lng: 9.1712 },
          photos: ['sempione1.jpg'],
          opening_hours: { open_now: true, periods: [] },
          price_level: 0
        }
      ];

      // Filter based on query if provided
      let filteredPlaces = mockPlaces;
      if (params.query) {
        filteredPlaces = mockPlaces.filter(place => 
          place.name.toLowerCase().includes(params.query!.toLowerCase()) ||
          place.types.some(type => type.includes(params.query!.toLowerCase()))
        );
      }

      // Filter by location proximity if provided
      if (params.location && params.radius) {
        filteredPlaces = filteredPlaces.filter(place => {
          const distance = calculateDistance(
            params.location!.lat, 
            params.location!.lng, 
            place.location.lat, 
            place.location.lng
          );
          return distance <= (params.radius! / 1000); // Convert meters to km
        });
      }

      setPlaces(filteredPlaces);
      return filteredPlaces;
      
    } catch (error) {
      toast.error('Errore nella ricerca dei luoghi');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<GooglePlace | null> => {
    setIsLoading(true);
    
    try {
      // Simulated Google Place Details API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const place = places.find(p => p.id === placeId);
      if (place) {
        return {
          ...place,
          reviews: [
            { author_name: 'Marco R.', rating: 5, text: 'Posto fantastico, altamente consigliato!' },
            { author_name: 'Anna S.', rating: 4, text: 'Molto bello, vale la pena visitarlo.' }
          ]
        };
      }
      return null;
      
    } catch (error) {
      toast.error('Errore nel recupero dei dettagli del luogo');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLng = deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI/180);
  };

  return {
    searchNearbyPlaces,
    getPlaceDetails,
    places,
    isLoading
  };
};