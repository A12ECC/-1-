'use client';

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Earth component with texture
const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const [bumpMap, specularMap] = useTexture([
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);
  
  // Earth rotation animation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        map={bumpMap}
        specularMap={specularMap}
        specular="#333333"
        shininess={5}
      />
    </mesh>
  );
};

// Cloud component
const Clouds = () => {
  const cloudRef = useRef<THREE.Mesh>(null);
  const cloudTexture = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png');

  useFrame(() => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.0015; // Clouds rotate slightly faster than Earth
    }
  });

  return (
    <mesh ref={cloudRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.05, 64, 64]} />
      <meshPhongMaterial
        map={cloudTexture}
        transparent={true}
        opacity={0.4}
        wireframe={false}
      />
    </mesh>
  );
};

// Atmosphere component
const Atmosphere = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[2.2, 64, 64]} />
      <meshPhongMaterial
        color="#87ceeb"
        transparent={true}
        opacity={0.1}
        wireframe={false}
      />
    </mesh>
  );
};

// Day/Night Cycle component
const SunLight = () => {
  return (
    <group>
      <pointLight 
        position={[5, 3, 5]} 
        intensity={1.5} 
        color="#FDB813" 
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};

// Floating info panel
const InfoPanel = () => {
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={1}>
      <Text
        position={[6, 4, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Earth
      </Text>
    </Float>
  );
};

// Main 3D Earth Scene component
const EarthScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <SunLight />
        
        {/* Stars background */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
        
        {/* Earth with clouds and atmosphere */}
        <group>
          <Suspense fallback={null}>
            <Earth />
            <Clouds />
            <Atmosphere />
          </Suspense>
          <InfoPanel />
        </group>
        
        {/* Controls for interaction */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.5}
          minDistance={3}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
};

export default EarthScene;