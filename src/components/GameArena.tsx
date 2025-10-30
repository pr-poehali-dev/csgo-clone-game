import { useEffect, useState, useCallback } from 'react';
import { Player, generateRandomDamage } from '@/lib/gameLogic';
import { GameHUD } from './GameHUD';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface GameArenaProps {
  onBackToMenu: () => void;
}

export const GameArena = ({ onBackToMenu }: GameArenaProps) => {
  const [player, setPlayer] = useState<Player>(new Player('Player1'));
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [enemies, setEnemies] = useState(3);
  const { toast } = useToast();

  const handleShoot = useCallback(() => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      const canShoot = newPlayer.shoot();
      
      if (canShoot) {
        const hit = Math.random() > 0.5;
        if (hit) {
          setKills(k => k + 1);
          setEnemies(e => Math.max(0, e - 1));
          toast({
            title: "KILL!",
            description: "Enemy eliminated",
            duration: 1000,
          });
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
  }, [toast]);

  const handleReload = useCallback(() => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      newPlayer.reload();
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

  return (
    <div className="min-h-screen w-full bg-background tactical-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"></div>
      
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

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="bg-black/60 backdrop-blur-sm border border-primary/30 rounded-lg p-12 max-w-2xl">
            <Icon name="Crosshair" size={80} className="text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">DEATHMATCH ACTIVE</h2>
            <p className="text-muted-foreground mb-8">
              Используйте WASD для перемещения и SPACE для стрельбы
            </p>
            
            <div className="flex justify-center gap-8 text-2xl font-bold">
              <div>
                <div className="text-muted-foreground text-sm mb-2">ENEMIES LEFT</div>
                <div className="text-destructive text-4xl">{enemies}</div>
              </div>
            </div>

            {enemies === 0 && (
              <div className="mt-8 space-y-4">
                <div className="text-3xl font-bold text-primary text-shadow-glow">
                  VICTORY!
                </div>
                <Button onClick={onBackToMenu} size="lg">
                  Back to Menu
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <GameHUD player={player} kills={kills} deaths={deaths} />
    </div>
  );
};
