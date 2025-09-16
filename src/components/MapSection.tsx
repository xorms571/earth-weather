'use client';

import React from 'react';
import { APIProvider, Map, MapMouseEvent, AdvancedMarker } from '@vis.gl/react-google-maps';
import { WeatherCard } from './WeatherCard';
import { Location, WeatherData } from '@/types/weather';

interface MapSectionProps {
  mapsApiKey: string;
  location: Location;
  handleMapClick: (event: MapMouseEvent) => void;
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  showWeatherCard: boolean;
  setShowWeatherCard: (show: boolean) => void;
}

export function MapSection({
  mapsApiKey,
  location,
  handleMapClick,
  weatherData,
  loading,
  error,
  showWeatherCard,
  setShowWeatherCard,
}: MapSectionProps) {
  return (
    <div className="relative flex items-center justify-center h-[50vh] md:h-screen">
      <div className="w-full h-full pointer-events-auto">
        <APIProvider apiKey={mapsApiKey}>
          <Map
            defaultCenter={location}
            zoom={4}
            gestureHandling={'auto'}
            onClick={handleMapClick}
            mapId="a2d92f3376276e9d"
          >
            <AdvancedMarker position={location} />
          </Map>
        </APIProvider>
      </div>

      <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto">
          {loading && (
            <div className="flex items-center justify-center space-x-2 text-white text-xl">
              <div className="w-24 h-24 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-lg">Error: {error}</div>}
          {weatherData && !loading && showWeatherCard && <WeatherCard weather={weatherData} onClose={() => setShowWeatherCard(false)} />}
        </div>
      </div>
    </div>
  );
}