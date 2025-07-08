import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
  } = options;

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Geolocalizzazione non supportata dal browser',
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = 'Errore durante il recupero della posizione';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Permesso di geolocalizzazione negato';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Posizione non disponibile';
          break;
        case error.TIMEOUT:
          errorMessage = 'Timeout nella richiesta di posizione';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      
      toast.error(errorMessage);
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [enableHighAccuracy, timeout, maximumAge]);

  const refetch = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      { enableHighAccuracy, timeout, maximumAge }
    );
  };

  return {
    ...state,
    refetch,
  };
};