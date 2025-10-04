'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          欢迎来到游戏中心
        </h1>
        <p className="text-xl text-gray-300 mb-10">
          选择您喜欢的游戏开始游玩
        </p>
        
        <div className="space-y-6">
          <Link 
            href="/"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`w-full max-w-xs mx-auto px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg transform transition-all duration-300 ${isHovered ? 'scale-105 shadow-2xl' : 'scale-100'}`}>
              <h2 className="text-2xl font-bold text-white">贪吃蛇游戏</h2>
              <p className="text-green-200 mt-2">经典复古游戏，挑战你的反应速度</p>
            </div>
          </Link>
          
          {/* 如果您有其他游戏，可以在这里添加更多游戏链接 */}
          
          <div className="mt-12 pt-6 border-t border-gray-700">
            <p className="text-gray-400">
              使用方向键或WASD控制，空格键暂停/继续
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}