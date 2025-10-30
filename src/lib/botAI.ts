export interface BotState {
  id: number;
  name: string;
  health: number;
  ammo: number;
  position: [number, number, number];
  isAlive: boolean;
  isMoving: boolean;
  isShooting: boolean;
  rotation: number;
  targetPosition?: [number, number, number];
}

export class BotAI {
  private bots: Map<number, BotState> = new Map();
  private lastActionTime: Map<number, number> = new Map();

  createBot(id: number, position: [number, number, number]): BotState {
    const bot: BotState = {
      id,
      name: `Terrorist ${id}`,
      health: 100,
      ammo: 30,
      position,
      isAlive: true,
      isMoving: false,
      isShooting: false,
      rotation: 0,
    };
    this.bots.set(id, bot);
    this.lastActionTime.set(id, Date.now());
    return bot;
  }

  updateBot(id: number, playerPosition: [number, number, number]): BotState | null {
    const bot = this.bots.get(id);
    if (!bot || !bot.isAlive) return bot || null;

    const now = Date.now();
    const lastAction = this.lastActionTime.get(id) || 0;
    
    if (now - lastAction < 1000) {
      return bot;
    }

    this.lastActionTime.set(id, now);

    const actions = ['move', 'shoot', 'jump', 'idle'];
    const action = actions[Math.floor(Math.random() * actions.length)];

    switch (action) {
      case 'move':
        this.moveBot(bot, playerPosition);
        break;
      case 'shoot':
        this.shootBot(bot, playerPosition);
        break;
      case 'jump':
        bot.isMoving = true;
        setTimeout(() => {
          bot.isMoving = false;
        }, 500);
        break;
      case 'idle':
        bot.isMoving = false;
        bot.isShooting = false;
        break;
    }

    if (Math.random() < 0.1) {
      const damage = Math.floor(Math.random() * 21) + 10;
      bot.health -= damage;
      if (bot.health <= 0) {
        bot.isAlive = false;
        bot.health = 0;
      }
    }

    return bot;
  }

  private moveBot(bot: BotState, playerPosition: [number, number, number]) {
    bot.isMoving = true;
    
    const dx = playerPosition[0] - bot.position[0];
    const dz = playerPosition[2] - bot.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 2) {
      const moveSpeed = 0.3;
      bot.position[0] += (dx / distance) * moveSpeed;
      bot.position[2] += (dz / distance) * moveSpeed;
      
      bot.rotation = Math.atan2(dx, dz);
    } else {
      const randomX = Math.random() * 20 - 10;
      const randomZ = Math.random() * 20 - 10;
      bot.targetPosition = [randomX, bot.position[1], randomZ];
    }

    setTimeout(() => {
      bot.isMoving = false;
    }, 1000);
  }

  private shootBot(bot: BotState, playerPosition: [number, number, number]) {
    if (bot.ammo > 0) {
      bot.ammo -= 1;
      bot.isShooting = true;

      const dx = playerPosition[0] - bot.position[0];
      const dz = playerPosition[2] - bot.position[2];
      bot.rotation = Math.atan2(dx, dz);

      setTimeout(() => {
        bot.isShooting = false;
      }, 200);

      return true;
    }
    return false;
  }

  takeDamage(id: number, damage: number): boolean {
    const bot = this.bots.get(id);
    if (!bot || !bot.isAlive) return false;

    bot.health -= damage;
    if (bot.health <= 0) {
      bot.isAlive = false;
      bot.health = 0;
      return true;
    }
    return false;
  }

  getBot(id: number): BotState | undefined {
    return this.bots.get(id);
  }

  getAllBots(): BotState[] {
    return Array.from(this.bots.values());
  }
}

export const botAI = new BotAI();
