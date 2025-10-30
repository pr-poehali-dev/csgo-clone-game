import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GameMenuProps {
  onStartGame: (mode: string) => void;
}

const gameModes = [
  {
    id: 'deathmatch',
    name: 'DEATHMATCH',
    description: 'Классический режим на выживание',
    icon: 'Crosshair',
    color: 'text-primary'
  },
  {
    id: 'bomb',
    name: 'BOMB DEFUSAL',
    description: 'Режим обезвреживания бомбы',
    icon: 'Bomb',
    color: 'text-destructive'
  },
  {
    id: 'team',
    name: 'TEAM VS TEAM',
    description: 'Командные сражения',
    icon: 'Users',
    color: 'text-blue-400'
  },
  {
    id: 'training',
    name: 'AIM TRAINING',
    description: 'Тренировочный режим',
    icon: 'Target',
    color: 'text-green-400'
  },
  {
    id: 'royale',
    name: 'BATTLE ROYALE',
    description: 'Королевская битва',
    icon: 'Trophy',
    color: 'text-yellow-400'
  }
];

export const GameMenu = ({ onStartGame }: GameMenuProps) => {
  return (
    <div className="min-h-screen w-full bg-background tactical-grid flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-primary text-shadow-glow">
            TACTICAL OPS
          </h1>
          <p className="text-muted-foreground text-lg">
            Выберите режим игры
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode) => (
            <Card 
              key={mode.id}
              className="bg-card/50 backdrop-blur-sm border-primary/30 hover:border-primary/60 transition-all cursor-pointer group"
              onClick={() => onStartGame(mode.id)}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Icon 
                    name={mode.icon as any} 
                    className={`${mode.color} group-hover:scale-110 transition-transform`}
                    size={32}
                  />
                  {mode.id === 'deathmatch' && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      AVAILABLE
                    </span>
                  )}
                  {mode.id !== 'deathmatch' && (
                    <span className="text-xs bg-muted/20 text-muted-foreground px-2 py-1 rounded">
                      COMING SOON
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{mode.name}</h3>
                  <p className="text-sm text-muted-foreground">{mode.description}</p>
                </div>
                <Button 
                  className="w-full"
                  variant={mode.id === 'deathmatch' ? 'default' : 'secondary'}
                  disabled={mode.id !== 'deathmatch'}
                >
                  {mode.id === 'deathmatch' ? 'ИГРАТЬ' : 'СКОРО'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Используйте WASD для движения • SPACE для стрельбы • R для перезарядки
          </p>
        </div>
      </div>
    </div>
  );
};
