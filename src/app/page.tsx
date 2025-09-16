'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import WeatherCard from '../components/WeatherCard';
import MapPicker from '../components/MapPicker';

// Define the type for our weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

// The Globe is now purely decorative
function Globe() {
  const texture = useTexture('/world-map.jpg');
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('OpenWeather API key is not configured.');
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data.');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-screen h-screen bg-gray-900">
      <Canvas>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Globe />
          <OrbitControls enablePan={false} minDistance={2.5} maxDistance={10} />
        </Suspense>
      </Canvas>

      {/* UI Elements Overlay */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <button 
          onClick={() => setShowMap(true)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 transition"
        >
          지도에서 위치 선택
        </button>
      </div>

      {showMap && <MapPicker onLocationSelect={fetchWeather} onClose={() => setShowMap(false)} />}

      {loading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl z-20">Loading...</div>
      )}
      {error && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/20 text-red-400 p-4 rounded-md z-20">Error: {error}</div>
      )}
      {weatherData && <WeatherCard weather={weatherData} onClose={() => setWeatherData(null)} />}
    </main>
  );
}
