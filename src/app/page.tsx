'use client';

import React, { useState, useEffect } from 'react';

import { GlobeSection } from '../components/GlobeSection';
import { MapSection } from '../components/MapSection';

import { useWeather } from '../hooks/useWeather';
import { MapMouseEvent } from '@vis.gl/react-google-maps';



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

      <MapSection
        mapsApiKey={mapsApiKey}
        location={location}
        handleMapClick={handleMapClick}
        weatherData={weatherData}
        loading={loading}
        error={error}
        showWeatherCard={showWeatherCard}
        setShowWeatherCard={setShowWeatherCard}
      />
    </main>
  );
}