'use client';

import EarthScene from '@/components/Earth3D';

export default function EarthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <header className="p-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Interactive 3D Earth</h1>
        <p className="text-gray-300 mt-2">
          Drag to rotate | Scroll to zoom | Right-click to pan
        </p>
      </header>
      
      <main className="flex-grow w-full max-w-6xl mx-auto p-4">
        <div className="w-full h-[70vh] rounded-xl overflow-hidden shadow-2xl bg-black">
          <EarthScene />
        </div>
        
        <div className="mt-6 text-gray-300">
          <h2 className="text-xl font-semibold text-white mb-2">About this 3D Earth</h2>
          <p className="mb-3">
            This interactive 3D visualization of Earth uses Three.js to render a realistic model 
            with rotation, atmospheric effects, and cloud cover.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The Earth rotates slowly to simulate day and night</li>
            <li>Cloud layer rotates slightly faster than the Earth</li>
            <li>Atmospheric glow effect around the planet</li>
            <li>Interactive controls allow you to explore the planet</li>
          </ul>
        </div>
      </main>
    </div>
  );
}