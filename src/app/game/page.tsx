'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import SnakeGame from '@/components/SnakeGame';

export default function GamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-2">
          贪吃蛇游戏
        </h1>
        <p className="text-center text-gray-300 mb-6">
          使用方向键或WASD控制蛇的移动
        </p>
        <SnakeGame />
      </div>
    </main>
  );
}