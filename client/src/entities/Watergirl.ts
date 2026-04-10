import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';
import { Character } from './Character';

export class Watergirl extends Character {
  private waterEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    super(
      scene,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE / 2,
      'watergirl',
      'water',
    );

    this.createAnimations();
    this.createWaterTrail();
  }

  private createAnimations() {
    const key = 'watergirl';

    if (!this.scene.anims.exists(`${key}_idle`)) {
      this.scene.anims.create({
        key: `${key}_idle`,
        frames: [{ key, frame: 0 }],
        frameRate: 4,
        repeat: -1,
      });
      this.scene.anims.create({
        key: `${key}_run`,
        frames: this.scene.anims.generateFrameNumbers(key, { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1,
      });
      this.scene.anims.create({
        key: `${key}_jump`,
        frames: [{ key, frame: 3 }],
        frameRate: 1,
      });
      this.scene.anims.create({
        key: `${key}_push`,
        frames: [{ key, frame: 4 }],
        frameRate: 1,
      });
      this.scene.anims.create({
        key: `${key}_death`,
        frames: [{ key, frame: 0 }],
        frameRate: 1,
      });
    }

    this.play(`${key}_idle`);
  }

  private createWaterTrail() {
    this.waterEmitter = this.scene.add.particles(0, 0, 'particle_water', {
      follow: this,
      followOffset: { x: 0, y: -12 },
      speed: { min: 5, max: 20 },
      scale: { start: 0.5, end: 0 },
      lifespan: 400,
      quantity: 1,
      frequency: 120,
      alpha: { start: 0.5, end: 0 },
    });
  }

  die() {
    super.die();
    this.waterEmitter?.stop();
  }

  reset(x: number, y: number) {
    super.reset(x, y);
    this.waterEmitter?.start();
  }

  destroy(fromScene?: boolean) {
    this.waterEmitter?.destroy();
    super.destroy(fromScene);
  }
}
