import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';
import { Character } from './Character';

export class Fireboy extends Character {
  private flameEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    super(
      scene,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE / 2,
      'fireboy',
      'fire',
    );

    this.createAnimations();
    this.createFlameTrail();
  }

  private createAnimations() {
    const key = 'fireboy';
    const frameWidth = TILE_SIZE;

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

  private createFlameTrail() {
    this.flameEmitter = this.scene.add.particles(0, 0, 'particle_fire', {
      follow: this,
      followOffset: { x: 0, y: -12 },
      speed: { min: 10, max: 30 },
      scale: { start: 0.6, end: 0 },
      lifespan: 300,
      quantity: 1,
      frequency: 100,
      alpha: { start: 0.7, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
    });
  }

  die() {
    super.die();
    this.flameEmitter?.stop();
  }

  reset(x: number, y: number) {
    super.reset(x, y);
    this.flameEmitter?.start();
  }

  destroy(fromScene?: boolean) {
    this.flameEmitter?.destroy();
    super.destroy(fromScene);
  }
}
