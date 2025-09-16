'use client';

import React, { Suspense, useRef, useState } from 'react';
import { Canvas, useLoader, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';
import WeatherCard from '../components/WeatherCard';

// Define the type for our weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description:string;
    icon: string;
  }[];
}

// Globe component now accepts a prop to pass click events up
function Globe({ onGlobeClick }: { onGlobeClick: (lat: number, lon: number) => void }) {
  const texture = useLoader(TextureLoader, '/world-map.jpg');
  const meshRef = useRef(null);

  const handleGlobeClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    // Use the 3D intersection point to calculate lat/lon
    const { point } = event;
    const radius = 2; // The radius of our sphere

    // Y is the up-axis, so latitude is derived from the Y coordinate
    const lat = Math.asin(point.y / radius) * (180 / Math.PI);
    
    // Longitude is the angle in the XZ plane
    const lon = Math.atan2(point.z, point.x) * (180 / Math.PI);

    onGlobeClick(lat, lon);
  };

  return (
    <mesh ref={meshRef} onClick={handleGlobeClick}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('API key is not configured.');
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
          <Globe onGlobeClick={fetchWeather} />
          <OrbitControls enablePan={false} minDistance={2.5} maxDistance={10} />
        </Suspense>
      </Canvas>
      {loading && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl">Loading...</div>
      )}
      {error && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-500 text-2xl">Error: {error}</div>
      )}
      {weatherData && <WeatherCard weather={weatherData} onClose={() => setWeatherData(null)} />}
    </main>
  );
}