'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useTexture, Stars } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Location } from '@/types/weather';

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

interface GlobeSectionProps {
  location: Location;
}

export function GlobeSection({ location }: GlobeSectionProps) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-black/20 h-[50vh] md:h-screen">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.3} />
            <pointLight color="#f0e6ff" position={[10, 10, 10]} intensity={1.5} />
            <Stars radius={150} depth={50} count={7000} factor={6} saturation={0} fade />
            <Globe location={location} />
          </Suspense>
        </Canvas>
      </div>
      <div className="z-10 text-start pointer-events-none">
        <h1 className="text-2xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Weather Of Earth</h1>
        <p className="text-white/60 mt-2 text-lg">Click the map to explore the globe and see live weather.</p>
        <ul className="mt-6 text-white/50 text-sm space-y-1 text-start">
          <li>Built with: Next.js, React, Tailwind CSS</li>
          <li>3D Graphics: Three.js, @react-three/fiber, @react-three/drei</li>
          <li>Maps: Google Maps Platform</li>
          <li>Weather Data: OpenWeatherMap</li>
          <li>Animations: GSAP</li>
        </ul>
      </div>
    </div>
  );
}