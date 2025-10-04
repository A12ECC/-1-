'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type Position = {
  x: number;
  y: number;
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const BOARD_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_FOOD: Position = { x: 5, y: 5 };
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 150;

const SnakeGame = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const directionRef = useRef(direction);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);

  // 生成新食物位置
  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      // 确保食物不在蛇身上
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, [snake]);

  // 检查碰撞
  const checkCollision = useCallback((head: Position): boolean => {
    // 检查边界
    if (
      head.x < 0 || 
      head.x >= BOARD_SIZE || 
      head.y < 0 || 
      head.y >= BOARD_SIZE
    ) {
      return true;
    }
    
    // 检查是否撞到自己
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  }, [snake]);

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameOverRef.current || isPausedRef.current || !gameStarted) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      
      // 根据方向移动头部
      switch (directionRef.current) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // 检查碰撞
      if (checkCollision(head)) {
        gameOverRef.current = true;
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];
      
      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setFood(generateFood());
        setScore(prev => prev + 10);
      } else {
        // 没吃到食物就移除尾部
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, checkCollision, gameStarted]);

  // 处理键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 防止方向键滚动页面
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault();
    }

    // 控制暂停/开始
    if (e.key === ' ' || e.key === 'Spacebar') {
      if (gameOverRef.current) {
        resetGame();
      } else {
        setIsPaused(prev => {
          isPausedRef.current = !prev;
          return !prev;
        });
      }
      return;
    }

    // 不在暂停或游戏结束时处理方向键
    if (isPausedRef.current || gameOverRef.current) return;

    // 更新方向，防止反向移动
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (directionRef.current !== 'DOWN') {
          setDirection('UP');
          directionRef.current = 'UP';
        }
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (directionRef.current !== 'UP') {
          setDirection('DOWN');
          directionRef.current = 'DOWN';
        }
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (directionRef.current !== 'RIGHT') {
          setDirection('LEFT');
          directionRef.current = 'LEFT';
        }
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (directionRef.current !== 'LEFT') {
          setDirection('RIGHT');
          directionRef.current = 'RIGHT';
        }
        break;
    }
  }, []);

  // 重置游戏
  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setGameOver(false);
    gameOverRef.current = false;
    setScore(0);
    setIsPaused(false);
    isPausedRef.current = false;
    setGameStarted(false);
  }, []);

  // 开始游戏
  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  // 更新ref以在回调中使用最新值
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // 设置游戏循环
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // 键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 渲染游戏板
  const renderBoard = () => {
    const board = [];
    
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isFood = food.x === x && food.y === y;
        
        let cellClass = 'w-4 h-4 sm:w-5 sm:h-5 border border-gray-800 ';
        
        if (isHead) {
          cellClass += 'bg-green-500 rounded-sm ';
        } else if (isSnake) {
          cellClass += 'bg-green-400 rounded-sm ';
        } else if (isFood) {
          cellClass += 'bg-red-500 rounded-full ';
        } else {
          cellClass += 'bg-gray-800 ';
        }
        
        board.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
          />
        );
      }
    }
    
    return board;
  };

  // 移动控制按钮
  const renderControlButton = (label: string, onClick: () => void, className: string = '') => (
    <button
      onClick={onClick}
      className={`w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 text-white rounded-lg flex items-center justify-center text-2xl font-bold active:bg-gray-700 ${className}`}
    >
      {label}
    </button>
  );

  // 处理移动控制
  const handleMoveUp = () => {
    if (directionRef.current !== 'DOWN') {
      setDirection('UP');
      directionRef.current = 'UP';
    }
  };

  const handleMoveDown = () => {
    if (directionRef.current !== 'UP') {
      setDirection('DOWN');
      directionRef.current = 'DOWN';
    }
  };

  const handleMoveLeft = () => {
    if (directionRef.current !== 'RIGHT') {
      setDirection('LEFT');
      directionRef.current = 'LEFT';
    }
  };

  const handleMoveRight = () => {
    if (directionRef.current !== 'LEFT') {
      setDirection('RIGHT');
      directionRef.current = 'RIGHT';
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 游戏信息栏 */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="text-xl font-bold text-white">分数: {score}</div>
        {!gameStarted && !gameOver && (
          <button
            onClick={startGame}
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            开始游戏
          </button>
        )}
        {gameStarted && !gameOver && (
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              isPausedRef.current = !isPaused;
            }}
            className="px-6 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
          >
            {isPaused ? '继续' : '暂停'}
          </button>
        )}
        {(gameOver || gameStarted) && (
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            重新开始
          </button>
        )}
      </div>

      {/* 游戏板 */}
      <div 
        className="grid gap-0 border-4 border-gray-700 rounded-lg overflow-hidden bg-gray-900 shadow-lg"
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          width: '100%',
          maxWidth: 'min(600px, 90vw)',
          aspectRatio: '1/1'
        }}
      >
        {renderBoard()}
      </div>

      {/* 游戏状态提示 */}
      {gameOver && (
        <div className="mt-6 text-center">
          <div className="text-2xl font-bold text-red-500 mb-2">游戏结束!</div>
          <div className="text-xl text-white">最终分数: {score}</div>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="mt-6 text-xl font-bold text-yellow-400">游戏暂停</div>
      )}

      {!gameStarted && !gameOver && (
        <div className="mt-6 text-center text-gray-300">
          <p className="mb-4">点击开始游戏，然后使用方向键或WASD控制蛇的移动</p>
        </div>
      )}

      {/* 移动端控制按钮 */}
      <div className="mt-8 md:hidden w-full max-w-xs">
        <div className="flex flex-col items-center space-y-4">
          <div>{renderControlButton('↑', handleMoveUp)}</div>
          <div className="flex space-x-4">
            {renderControlButton('←', handleMoveLeft)}
            {renderControlButton('↓', handleMoveDown)}
            {renderControlButton('→', handleMoveRight)}
          </div>
        </div>
      </div>

      {/* 游戏说明 */}
      <div className="mt-6 text-gray-400 text-sm text-center max-w-md">
        <p>使用方向键或WASD控制蛇的移动方向</p>
        <p>吃到红色食物可以增加分数，避免撞到墙壁或自己的身体</p>
      </div>
    </div>
  );
};

export default SnakeGame;