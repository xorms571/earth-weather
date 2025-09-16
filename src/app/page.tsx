'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Stars } from '@react-three/drei';
import { APIProvider, Map, MapMouseEvent, AdvancedMarker } from '@vis.gl/react-google-maps';
import { WeatherCard } from '../components/WeatherCard';
import { gsap } from 'gsap';
import * as THREE from 'three';

// Define the type for our weather data
interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}

interface Location {
  lat: number;
  lng: number;
}

// Globe component that rotates based on location prop
function Globe({ location }: { location: Location }) {
  const texture = useTexture('/world-map.jpg');
  const meshRef = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    if (location && meshRef.current) {
      const phi = (90 - location.lat) * (Math.PI / 180); // Convert latitude to spherical coordinate phi
      const theta = (location.lng + 180) * (Math.PI / 180); // Convert longitude to spherical coordinate theta

      // Calculate Cartesian coordinates on the sphere
      const x = -Math.sin(phi) * Math.cos(theta);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta);

      // Create a target vector for the camera to look at
      const targetVector = new THREE.Vector3(x, y, z);

      // Animate the rotation using gsap
      gsap.to(meshRef.current.rotation, {
        x: -phi + Math.PI / 2, // Adjust for sphere's default orientation
        y: -theta + Math.PI / 2, // Adjust for texture's prime meridian
        duration: 1.5,
        ease: 'power3.inOut',
      });
    }
  }, [location]);

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location>({ lat: 37.5665, lng: 126.9780 });

  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchWeather = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    // Keep previous weather data until new data is fetched

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      setError('OpenWeather API key is not configured.');
      setLoading(false);
      return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch weather data.');
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(location.lat, location.lng);
  }, []);

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      const newLocation = event.detail.latLng;
      setLocation(newLocation);
      fetchWeather(newLocation.lat, newLocation.lng);
    }
  };

  if (!mapsApiKey) {
    return <div className="w-screen h-screen flex items-center justify-center bg-gray-900 text-red-500">Google Maps API Key is not configured.</div>
  }

  return (
    <main className="w-screen h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left Side: Globe and Title */}
      <div className="relative flex flex-col items-center justify-center p-8 bg-black/20 h-[50vh] md:h-screen">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight color="#f0e6ff" position={[10, 10, 10]} intensity={1.5} />
              <Stars radius={150} depth={50} count={7000} factor={6} saturation={0} fade />
              <Globe location={location} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
        <div className="z-10 text-center pointer-events-none">
          <h1 className="text-2xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Weather Of Earth</h1>
          <p className="text-white/60 mt-2 text-lg">Click the map to explore the globe and see live weather.</p>
          <div className="mt-6 text-white/50 text-sm space-y-1 text-start">
            <p>Built with: Next.js, React, Tailwind CSS</p>
            <p>3D Graphics: Three.js, @react-three/fiber, @react-three/drei</p>
            <p>Maps: Google Maps Platform</p>
            <p>Weather Data: OpenWeatherMap</p>
            <p>Animations: GSAP</p>
          </div>
        </div>
      </div>

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
            {weatherData && !loading && <WeatherCard weather={weatherData} onClose={() => setWeatherData(null)} />}
          </div>
        </div>
      </div>
    </main>
  );
}
