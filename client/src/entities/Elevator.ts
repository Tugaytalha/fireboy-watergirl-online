import Phaser from 'phaser';
import { TILE_SIZE, ELEVATOR_DEFAULT_SPEED } from '@fbwg/shared';

export class Elevator extends Phaser.Physics.Arcade.Sprite {
  public elevatorId: string;
  private topY: number;
  private bottomY: number;
  private moveSpeed: number;
  public isActive = false;

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    bottomTileY: number,
    topTileY: number,
    id: string,
    speed?: number,
  ) {
    const startX = tileX * TILE_SIZE + TILE_SIZE;
    const startY = bottomTileY * TILE_SIZE + 5;
    super(scene, startX, startY, 'elevator');
    this.elevatorId = id;
    this.moveSpeed = speed ?? ELEVATOR_DEFAULT_SPEED;
    this.topY = topTileY * TILE_SIZE + 5;
    this.bottomY = startY;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setFrictionX(1);
  }

  update() {
    const body = this.body as Phaser.Physics.Arcade.Body;

    if (this.isActive) {
      // Move up
      if (this.y > this.topY) {
        body.setVelocityY(-this.moveSpeed);
      } else {
        this.y = this.topY;
        body.setVelocityY(0);
      }
    } else {
      // Move down
      if (this.y < this.bottomY) {
        body.setVelocityY(this.moveSpeed);
      } else {
        this.y = this.bottomY;
        body.setVelocityY(0);
      }
    }
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}
