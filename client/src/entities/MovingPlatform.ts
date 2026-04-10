import Phaser from 'phaser';
import { TILE_SIZE, MOVING_PLATFORM_DEFAULT_SPEED, Vec2 } from '@fbwg/shared';

export class MovingPlatform extends Phaser.Physics.Arcade.Sprite {
  public platformId: string;
  private waypoints: { x: number; y: number }[];
  private currentWaypointIndex = 0;
  private moveSpeed: number;
  private direction = 1; // 1 = forward, -1 = backward
  public isActive = true;

  constructor(
    scene: Phaser.Scene,
    path: Vec2[],
    id: string,
    speed?: number,
  ) {
    const startX = path[0].x * TILE_SIZE + TILE_SIZE;
    const startY = path[0].y * TILE_SIZE + 5;
    super(scene, startX, startY, 'moving_platform');
    this.platformId = id;
    this.moveSpeed = speed ?? MOVING_PLATFORM_DEFAULT_SPEED;

    this.waypoints = path.map((p) => ({
      x: p.x * TILE_SIZE + TILE_SIZE,
      y: p.y * TILE_SIZE + 5,
    }));

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setFrictionX(1);
  }

  update() {
    if (!this.isActive || this.waypoints.length < 2) return;

    const target = this.waypoints[this.currentWaypointIndex];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      this.setPosition(target.x, target.y);
      this.currentWaypointIndex += this.direction;

      if (this.currentWaypointIndex >= this.waypoints.length) {
        this.direction = -1;
        this.currentWaypointIndex = this.waypoints.length - 2;
      } else if (this.currentWaypointIndex < 0) {
        this.direction = 1;
        this.currentWaypointIndex = 1;
      }
    } else {
      const body = this.body as Phaser.Physics.Arcade.Body;
      const vx = (dx / dist) * this.moveSpeed;
      const vy = (dy / dist) * this.moveSpeed;
      body.setVelocity(vx, vy);
    }
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
    (this.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
  }
}
