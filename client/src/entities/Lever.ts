import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';

export class Lever extends Phaser.Physics.Arcade.Sprite {
  public leverId: string;
  public isOn = false;
  public targets: string[];
  private cooldown = false;

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    id: string,
    targets: string[],
  ) {
    super(
      scene,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + TILE_SIZE / 2,
      'lever_left',
    );
    this.leverId = id;
    this.targets = targets;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(TILE_SIZE - 4, TILE_SIZE - 4);
  }

  toggle() {
    if (this.cooldown) return;
    this.cooldown = true;

    this.isOn = !this.isOn;
    this.setTexture(this.isOn ? 'lever_right' : 'lever_left');

    if (this.isOn) {
      this.scene.events.emit('lever-activate', this.targets);
    } else {
      this.scene.events.emit('lever-deactivate', this.targets);
    }

    // Prevent rapid toggling
    this.scene.time.delayedCall(300, () => {
      this.cooldown = false;
    });
  }
}
