'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useLoader, ThreeEvent } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { TextureLoader } from 'three';

// Globe component
function Globe() {
  const texture = useLoader(TextureLoader, '/world-map.jpg');
  const meshRef = useRef(null);

  const handleGlobeClick = (event: ThreeEvent<MouseEvent>) => {
    // Stop propagation to avoid conflicts with OrbitControls
    event.stopPropagation();

    if (meshRef.current) {
      const { uv } = event;
      if (uv) {
        // Convert UV coordinates to latitude and longitude
        const lat = -(uv.y - 0.5) * 180;
        const lon = (uv.x - 0.5) * 360;
        console.log(`Latitude: ${lat.toFixed(2)}, Longitude: ${lon.toFixed(2)}`);
      }
    }
  };

  return (
    <mesh ref={meshRef} onClick={handleGlobeClick}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function Home() {
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
    </main>
  );
}
