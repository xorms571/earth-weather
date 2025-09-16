'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Stars } from '@react-three/drei';
import { APIProvider, Map, MapMouseEvent, AdvancedMarker } from '@vis.gl/react-google-maps';
import { WeatherCard } from '../components/WeatherCard';
import { GlobeSection } from '../components/GlobeSection';
import { gsap } from 'gsap';

import { useWeather } from '../hooks/useWeather';
import { Location, WeatherData } from '@/types/weather';



export default function Home() {
  const { weatherData, loading, error, location, setLocation } = useWeather({ lat: 37.5665, lng: 126.9780 });
  const [showWeatherCard, setShowWeatherCard] = useState(true);

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (weatherData) {
      setShowWeatherCard(true);
    }
  }, [weatherData]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const newLocation = event.detail.latLng;
      setLocation(newLocation);
    }
  };

  if (!mapsApiKey) {
    return <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-red-500">Google Maps API Key is not configured.</div>
  }

  return (
    <main className="w-screen h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <GlobeSection location={location} />

      {/* Right Side: Map and Weather Info */}
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
    </main>
  );
}