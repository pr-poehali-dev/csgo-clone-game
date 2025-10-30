import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export interface CheatState {
  aimbot: boolean;
  esp: boolean;
  speed: boolean;
  fly: boolean;
}

interface CheatMenuProps {
  isOpen: boolean;
  cheats: CheatState;
  onCheatToggle: (cheat: keyof CheatState) => void;
}

export const CheatMenu = ({ isOpen, cheats, onCheatToggle }: CheatMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right">
      <Card className="bg-black/90 backdrop-blur-sm border-red-500/50 p-6 min-w-[280px]">
        <div className="flex items-center gap-2 mb-4 border-b border-red-500/30 pb-2">
          <Icon name="Shield" className="text-red-500" size={20} />
          <h3 className="text-lg font-bold text-red-500">CHEAT MENU</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Crosshair" size={16} className="text-red-400" />
              <Label htmlFor="aimbot" className="text-sm cursor-pointer">
                Aim Bot
              </Label>
            </div>
            <Switch
              id="aimbot"
              checked={cheats.aimbot}
              onCheckedChange={() => onCheatToggle('aimbot')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Eye" size={16} className="text-yellow-400" />
              <Label htmlFor="esp" className="text-sm cursor-pointer">
                ESP (Wallhack)
              </Label>
            </div>
            <Switch
              id="esp"
              checked={cheats.esp}
              onCheckedChange={() => onCheatToggle('esp')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Zap" size={16} className="text-blue-400" />
              <Label htmlFor="speed" className="text-sm cursor-pointer">
                Speed Hack
              </Label>
            </div>
            <Switch
              id="speed"
              checked={cheats.speed}
              onCheckedChange={() => onCheatToggle('speed')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Plane" size={16} className="text-green-400" />
              <Label htmlFor="fly" className="text-sm cursor-pointer">
                Fly Mode
              </Label>
            </div>
            <Switch
              id="fly"
              checked={cheats.fly}
              onCheckedChange={() => onCheatToggle('fly')}
            />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-red-500/30">
          <p className="text-xs text-muted-foreground text-center">
            Press <kbd className="px-2 py-1 bg-red-500/20 rounded">Q</kbd> to toggle
          </p>
        </div>
      </Card>
    </div>
  );
};
