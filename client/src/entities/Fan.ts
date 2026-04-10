import Phaser from 'phaser';
import { TILE_SIZE, FAN_WIND_STRENGTH, FanDirection } from '@fbwg/shared';

export class Fan extends Phaser.Physics.Arcade.Sprite {
  public fanId: string;
  public direction: FanDirection;
  public windStrength: number;
  public windZone!: Phaser.GameObjects.Zone;
  public isActive = true;
  private zoneLength: number;

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    id: string,
    direction: FanDirection,
    zoneLength = 4,
    strength?: number,
  ) {
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, 'fan');
    this.fanId = id;
    this.direction = direction;
    this.zoneLength = zoneLength;
    this.windStrength = strength ?? FAN_WIND_STRENGTH;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    // Rotate sprite based on direction
    if (direction === FanDirection.LEFT) this.setAngle(90);
    else if (direction === FanDirection.RIGHT) this.setAngle(-90);

    this.createWindZone(scene, tileX, tileY);
  }

  private createWindZone(scene: Phaser.Scene, tileX: number, tileY: number) {
    let zx: number, zy: number, zw: number, zh: number;
    const len = this.zoneLength * TILE_SIZE;

    switch (this.direction) {
      case FanDirection.UP:
        zx = tileX * TILE_SIZE + TILE_SIZE / 2;
        zy = tileY * TILE_SIZE - len / 2;
        zw = TILE_SIZE;
        zh = len;
        break;
      case FanDirection.LEFT:
        zx = tileX * TILE_SIZE - len / 2;
        zy = tileY * TILE_SIZE + TILE_SIZE / 2;
        zw = len;
        zh = TILE_SIZE;
        break;
      case FanDirection.RIGHT:
        zx = tileX * TILE_SIZE + TILE_SIZE + len / 2;
        zy = tileY * TILE_SIZE + TILE_SIZE / 2;
        zw = len;
        zh = TILE_SIZE;
        break;
    }

    this.windZone = scene.add.zone(zx!, zy!, zw!, zh!);
    scene.physics.add.existing(this.windZone, true);
  }

  applyWind(characterBody: Phaser.Physics.Arcade.Body) {
    if (!this.isActive) return;

    switch (this.direction) {
      case FanDirection.UP:
        characterBody.setVelocityY(characterBody.velocity.y - this.windStrength * 0.1);
        break;
      case FanDirection.LEFT:
        characterBody.setVelocityX(characterBody.velocity.x - this.windStrength * 0.1);
        break;
      case FanDirection.RIGHT:
        characterBody.setVelocityX(characterBody.velocity.x + this.windStrength * 0.1);
        break;
    }
  }

  activate() {
    this.isActive = true;
  }

  deactivate() {
    this.isActive = false;
  }
}
