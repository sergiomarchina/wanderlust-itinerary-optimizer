export interface ItineraryItem {
  id: string;
  name: string;
  time: string;
  duration: string;
  type: string;
  rating: number;
  image: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  estimatedCost?: string;
  notes?: string;
}

export interface TravelDay {
  id: string;
  date: string;
  items: ItineraryItem[];
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  days: TravelDay[];
  participants: number;
  status: 'planning' | 'active' | 'completed';
}