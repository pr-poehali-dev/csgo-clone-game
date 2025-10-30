import { useEffect, useState, useCallback } from 'react';
import { Player, generateRandomDamage } from '@/lib/gameLogic';
import { GameHUD } from './GameHUD';
import { Game3DScene } from './Game3DScene';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { audioManager } from '@/lib/soundEffects';
import Icon from '@/components/ui/icon';

interface GameArenaProps {
  onBackToMenu: () => void;
}

interface Enemy {
  id: number;
  position: [number, number, number];
  alive: boolean;
}

export const GameArena = ({ onBackToMenu }: GameArenaProps) => {
  const [player, setPlayer] = useState<Player>(new Player('Player1'));
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [recoil, setRecoil] = useState(false);
  const [enemyBots, setEnemyBots] = useState<Enemy[]>([
    { id: 1, position: [-8, 1, -5], alive: true },
    { id: 2, position: [8, 1, -5], alive: true },
    { id: 3, position: [0, 1, -10], alive: true },
  ]);
  const { toast } = useToast();

  const handleEnemyHit = useCallback((enemyId: number) => {
    setEnemyBots(prev => 
      prev.map(enemy => 
        enemy.id === enemyId ? { ...enemy, alive: false } : enemy
      )
    );
    audioManager.playHitSound();
    setKills(k => k + 1);
    toast({
      title: "KILL!",
      description: "Enemy eliminated",
      duration: 1000,
    });
  }, [toast]);

  const handleShoot = useCallback(() => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      const canShoot = newPlayer.shoot();
      
      if (canShoot) {
        audioManager.playShootSound();
        setRecoil(true);
        setTimeout(() => setRecoil(false), 100);
        
        const hit = Math.random() > 0.4;
        if (hit) {
          const aliveEnemies = enemyBots.filter(e => e.alive);
          if (aliveEnemies.length > 0) {
            const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            handleEnemyHit(randomEnemy.id);
          }
        }
      } else {
        toast({
          title: "Out of ammo!",
          description: "Press R to reload",
          variant: "destructive",
          duration: 1000,
        });
      }
      
      return newPlayer;
    });
  }, [toast, enemyBots, handleEnemyHit]);

  const handleReload = useCallback(() => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      newPlayer.reload();
      audioManager.playReloadSound();
      toast({
        title: "Reloading...",
        description: "Ammo refilled",
        duration: 1000,
      });
      return newPlayer;
    });
  }, [toast]);

  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      newPlayer.move(direction);
      return newPlayer;
    });
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'w':
          handleMove('up');
          break;
        case 's':
          handleMove('down');
          break;
        case 'a':
          handleMove('left');
          break;
        case 'd':
          handleMove('right');
          break;
        case ' ':
          e.preventDefault();
          handleShoot();
          break;
        case 'r':
          handleReload();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove, handleShoot, handleReload]);

  useEffect(() => {
    const enemyInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPlayer(prev => {
          if (!prev.isAlive()) return prev;
          
          const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
          const damage = generateRandomDamage();
          newPlayer.takeDamage(damage);
          audioManager.playDamageSound();
          
          if (!newPlayer.isAlive()) {
            setDeaths(d => d + 1);
            toast({
              title: "ELIMINATED",
              description: "Respawning...",
              variant: "destructive",
            });
            
            setTimeout(() => {
              setPlayer(new Player('Player1'));
            }, 2000);
          }
          
          return newPlayer;
        });
      }
    }, 3000);

    return () => clearInterval(enemyInterval);
  }, [toast]);

  const aliveEnemiesCount = enemyBots.filter(e => e.alive).length;

  useEffect(() => {
    if (aliveEnemiesCount === 0 && enemyBots.length > 0) {
      audioManager.playVictorySound();
    }
  }, [aliveEnemiesCount, enemyBots.length]);

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <Game3DScene 
        playerPosition={player.position} 
        recoil={recoil}
        enemies={enemyBots}
        onEnemyHit={handleEnemyHit}
      />
      
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onBackToMenu}
          className="bg-black/80 backdrop-blur-sm border-primary/30"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Back to Menu
        </Button>
      </div>

      {aliveEnemiesCount === 0 && enemyBots.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-sm border border-primary rounded-lg p-12 pointer-events-auto">
            <div className="text-5xl font-bold text-primary text-shadow-glow mb-4">
              VICTORY!
            </div>
            <Button onClick={onBackToMenu} size="lg" className="w-full">
              Back to Menu
            </Button>
          </div>
        </div>
      )}

      <GameHUD player={player} kills={kills} deaths={deaths} />
    </div>
  );
};