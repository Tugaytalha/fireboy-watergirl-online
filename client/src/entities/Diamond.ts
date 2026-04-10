import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';

export class Diamond extends Phaser.Physics.Arcade.Sprite {
  public diamondType: 'red' | 'blue';
  public collected = false;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, type: 'red' | 'blue') {
    const texture = type === 'red' ? 'diamond_red' : 'diamond_blue';
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, texture);
    this.diamondType = type;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(20, 20);

    // Floating bob animation
    scene.tweens.add({
      targets: this,
      y: this.y - 4,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  collect() {
    if (this.collected) return;
    this.collected = true;

    // Sparkle burst
    const color = this.diamondType === 'red' ? 0xff3333 : 0x3399ff;
    const g = this.scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(color);
    g.fillCircle(3, 3, 3);
    g.generateTexture(`sparkle_${this.diamondType}`, 6, 6);
    g.destroy();

    const emitter = this.scene.add.particles(this.x, this.y, `sparkle_${this.diamondType}`, {
      speed: { min: 40, max: 100 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 8,
      emitting: false,
    });
    emitter.explode(8);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 1.5,
      duration: 200,
      onComplete: () => this.destroy(),
    });
  }
}
