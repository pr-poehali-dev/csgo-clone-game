import { useState } from 'react';
import { GameMenu } from '@/components/GameMenu';
import { GameArena } from '@/components/GameArena';

const Index = () => {
  const [gameMode, setGameMode] = useState<string | null>(null);

  const handleStartGame = (mode: string) => {
    if (mode === 'deathmatch') {
      setGameMode(mode);
    }
  };

  const handleBackToMenu = () => {
    setGameMode(null);
  };

  return (
    <div className="min-h-screen">
      {!gameMode ? (
        <GameMenu onStartGame={handleStartGame} />
      ) : (
        <GameArena onBackToMenu={handleBackToMenu} />
      )}
    </div>
  );
};

export default Index;
