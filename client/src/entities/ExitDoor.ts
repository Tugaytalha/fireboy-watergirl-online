import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';
import { CharacterElement } from './Character';

export class ExitDoor extends Phaser.Physics.Arcade.Sprite {
  public doorElement: CharacterElement;
  public isOccupied = false;
  private glowEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, element: CharacterElement) {
    const texture = element === 'fire' ? 'exit_fire' : 'exit_water';
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, texture);
    this.doorElement = element;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(TILE_SIZE - 8, TILE_SIZE - 4);
  }

  setOccupied(occupied: boolean) {
    this.isOccupied = occupied;

    if (occupied && !this.glowEmitter) {
      const particleKey = this.doorElement === 'fire' ? 'particle_fire' : 'particle_water';
      this.glowEmitter = this.scene.add.particles(this.x, this.y, particleKey, {
        speed: { min: 5, max: 20 },
        scale: { start: 0.5, end: 0 },
        lifespan: 600,
        quantity: 1,
        frequency: 80,
        alpha: { start: 0.6, end: 0 },
      });
    }

    if (!occupied && this.glowEmitter) {
      this.glowEmitter.destroy();
      this.glowEmitter = undefined;
    }
  }

  destroy(fromScene?: boolean) {
    this.glowEmitter?.destroy();
    super.destroy(fromScene);
  }
}
