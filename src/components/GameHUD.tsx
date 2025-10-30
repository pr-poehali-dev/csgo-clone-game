import { Player } from '@/lib/gameLogic';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface GameHUDProps {
  player: Player;
  kills: number;
  deaths: number;
}

export const GameHUD = ({ player, kills, deaths }: GameHUDProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="relative w-full h-full">
        <div className="absolute top-4 left-4 space-y-2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Heart" className="text-destructive" size={20} />
              <span className="text-sm font-semibold">HEALTH</span>
            </div>
            <Progress value={player.health} className="h-3 mb-1" />
            <span className="text-xs text-muted-foreground">{player.health}/100</span>
          </div>

          <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded p-4 min-w-[200px]">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Crosshair" className="text-primary" size={20} />
              <span className="text-sm font-semibold">AMMO</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {player.ammo}
              <span className="text-sm text-muted-foreground ml-1">/ 30</span>
            </div>
          </div>
        </div>

        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded p-4 min-w-[200px]">
            <div className="text-xs text-muted-foreground mb-2">SCOREBOARD</div>
            <div className="flex justify-between items-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{kills}</div>
                <div className="text-xs text-muted-foreground">KILLS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive">{deaths}</div>
                <div className="text-xs text-muted-foreground">DEATHS</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded p-3">
            <div className="text-xs text-muted-foreground mb-2">MINIMAP</div>
            <div className="w-32 h-32 bg-black/60 border border-primary/20 rounded relative tactical-grid">
              <div 
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/80 backdrop-blur-sm border border-primary/30 rounded px-6 py-3">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">W</kbd>
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">A</kbd>
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">S</kbd>
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">D</kbd>
                <span className="text-muted-foreground">Move</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">SPACE</kbd>
                <span className="text-muted-foreground">Shoot</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono">R</kbd>
                <span className="text-muted-foreground">Reload</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-primary rounded-full opacity-80"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0.5 h-3 bg-primary"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-3 bg-primary"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full h-0.5 w-3 bg-primary"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full h-0.5 w-3 bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
