export interface Position {
  x: number;
  y: number;
}

export class Player {
  name: string;
  health: number;
  ammo: number;
  position: Position;
  maxHealth: number = 100;
  maxAmmo: number = 30;

  constructor(name: string) {
    this.name = name;
    this.health = 100;
    this.ammo = 30;
    this.position = { x: 0, y: 0 };
  }

  move(direction: 'up' | 'down' | 'left' | 'right'): void {
    const moveSpeed = 1;
    switch (direction) {
      case 'up':
        this.position = { x: this.position.x, y: this.position.y + moveSpeed };
        break;
      case 'down':
        this.position = { x: this.position.x, y: this.position.y - moveSpeed };
        break;
      case 'left':
        this.position = { x: this.position.x - moveSpeed, y: this.position.y };
        break;
      case 'right':
        this.position = { x: this.position.x + moveSpeed, y: this.position.y };
        break;
    }
  }

  shoot(): boolean {
    if (this.ammo > 0) {
      this.ammo -= 1;
      return true;
    }
    return false;
  }

  takeDamage(damage: number): void {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }

  reload(): void {
    this.ammo = this.maxAmmo;
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}

export const generateRandomDamage = (): number => {
  return Math.floor(Math.random() * 20) + 10;
};
