import { useEffect, useState, useCallback, useRef } from 'react';
import { Player, generateRandomDamage } from '@/lib/gameLogic';
import { GameHUD } from './GameHUD';
import { Game3DScene } from './Game3DScene';
import { CheatMenu, CheatState } from './CheatMenu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { audioManager } from '@/lib/soundEffects';
import { botAI, BotState } from '@/lib/botAI';
import Icon from '@/components/ui/icon';

interface GameArenaProps {
  onBackToMenu: () => void;
}

export const GameArena = ({ onBackToMenu }: GameArenaProps) => {
  const [player, setPlayer] = useState<Player>(new Player('Player1'));
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [recoil, setRecoil] = useState(false);
  const [enemyBots, setEnemyBots] = useState<BotState[]>([]);
  const [cheats, setCheats] = useState<CheatState>({
    aimbot: false,
    esp: false,
    speed: false,
    fly: false,
  });
  const [cheatMenuOpen, setCheatMenuOpen] = useState(false);
  const { toast } = useToast();
  const botUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initialBots = [
      botAI.createBot(1, [-8, 1, -5]),
      botAI.createBot(2, [8, 1, -5]),
      botAI.createBot(3, [0, 1, -10]),
      botAI.createBot(4, [-5, 1, 8]),
      botAI.createBot(5, [5, 1, 8]),
    ];
    setEnemyBots(initialBots);

    botUpdateInterval.current = setInterval(() => {
      const playerPos: [number, number, number] = [player.position.x, 1, player.position.y];
      const updatedBots = botAI.getAllBots().map(bot => 
        botAI.updateBot(bot.id, playerPos) || bot
      );
      setEnemyBots(updatedBots);
    }, 1000);

    return () => {
      if (botUpdateInterval.current) {
        clearInterval(botUpdateInterval.current);
      }
    };
  }, [player.position.x, player.position.y]);

  const handleCheatToggle = (cheat: keyof CheatState) => {
    setCheats(prev => ({ ...prev, [cheat]: !prev[cheat] }));
    toast({
      title: `Cheat ${cheats[cheat] ? 'Disabled' : 'Enabled'}`,
      description: cheat.toUpperCase(),
      duration: 1000,
    });
  };

  const handleEnemyHit = useCallback((enemyId: number) => {
    const killed = botAI.takeDamage(enemyId, 100);
    if (killed) {
      audioManager.playHitSound();
      setKills(k => k + 1);
      toast({
        title: "KILL!",
        description: "Terrorist eliminated",
        duration: 1000,
      });
      setEnemyBots(botAI.getAllBots());
    }
  }, [toast]);

  const handleShoot = useCallback(() => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      const canShoot = newPlayer.shoot();
      
      if (canShoot) {
        audioManager.playShootSound();
        setRecoil(true);
        setTimeout(() => setRecoil(false), 100);
        
        let targetEnemy: BotState | null = null;

        if (cheats.aimbot) {
          const aliveEnemies = enemyBots.filter(e => e.isAlive);
          if (aliveEnemies.length > 0) {
            aliveEnemies.sort((a, b) => {
              const distA = Math.sqrt(
                Math.pow(a.position[0] - player.position.x, 2) +
                Math.pow(a.position[2] - player.position.y, 2)
              );
              const distB = Math.sqrt(
                Math.pow(b.position[0] - player.position.x, 2) +
                Math.pow(b.position[2] - player.position.y, 2)
              );
              return distA - distB;
            });
            targetEnemy = aliveEnemies[0];
          }
        } else {
          const hit = Math.random() > 0.4;
          if (hit) {
            const aliveEnemies = enemyBots.filter(e => e.isAlive);
            if (aliveEnemies.length > 0) {
              targetEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
            }
          }
        }

        if (targetEnemy) {
          handleEnemyHit(targetEnemy.id);
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
  }, [toast, enemyBots, handleEnemyHit, cheats.aimbot, player.position]);

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

  const handleMove = useCallback((direction: 'forward' | 'backward' | 'left' | 'right') => {
    setPlayer(prev => {
      const newPlayer = Object.assign(Object.create(Object.getPrototypeOf(prev)), prev);
      const moveSpeed = cheats.speed ? 2 : 1;
      
      const moveAmount = 0.5 * moveSpeed;
      switch(direction) {
        case 'forward':
          newPlayer.position.y -= moveAmount;
          break;
        case 'backward':
          newPlayer.position.y += moveAmount;
          break;
        case 'left':
          newPlayer.position.x -= moveAmount;
          break;
        case 'right':
          newPlayer.position.x += moveAmount;
          break;
      }
      
      if (cheats.fly) {
        newPlayer.position.y = Math.max(-15, Math.min(15, newPlayer.position.y));
        newPlayer.position.x = Math.max(-15, Math.min(15, newPlayer.position.x));
      } else {
        newPlayer.position.y = Math.max(-10, Math.min(10, newPlayer.position.y));
        newPlayer.position.x = Math.max(-10, Math.min(10, newPlayer.position.x));
      }
      
      return newPlayer;
    });
  }, [cheats.speed, cheats.fly]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key.toLowerCase()) {
        case 'q':
          setCheatMenuOpen(prev => !prev);
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
  }, [handleShoot, handleReload]);

  useEffect(() => {
    const enemyInterval = setInterval(() => {
      if (Math.random() > 0.8) {
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

  const aliveEnemiesCount = enemyBots.filter(e => e.isAlive).length;

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
        onMove={handleMove}
        espEnabled={cheats.esp}
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

      <CheatMenu 
        isOpen={cheatMenuOpen} 
        cheats={cheats} 
        onCheatToggle={handleCheatToggle} 
      />

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
