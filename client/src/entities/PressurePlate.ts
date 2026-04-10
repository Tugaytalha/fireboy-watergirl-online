import Phaser from 'phaser';
import { TILE_SIZE, PlateActivator } from '@fbwg/shared';

export class PressurePlate extends Phaser.Physics.Arcade.Sprite {
  public plateId: string;
  public activator: PlateActivator;
  public isPressed = false;
  public targets: string[];

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    id: string,
    activator: PlateActivator,
    targets: string[],
  ) {
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, 'plate');
    this.plateId = id;
    this.activator = activator;
    this.targets = targets;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(TILE_SIZE - 4, 8);
    body.setOffset(2, TILE_SIZE - 8);

    // Color tint by activator type
    if (activator === PlateActivator.FIRE) {
      this.setTint(0xff6600);
    } else if (activator === PlateActivator.WATER) {
      this.setTint(0x3399ff);
    }
  }

  press() {
    if (this.isPressed) return;
    this.isPressed = true;
    this.setTexture('plate_pressed');
    this.scene.events.emit('plate-activate', this.targets);
  }

  release() {
    if (!this.isPressed) return;
    this.isPressed = false;
    this.setTexture('plate');
    this.scene.events.emit('plate-deactivate', this.targets);
  }

  canBeActivatedBy(element: 'fire' | 'water' | 'crate'): boolean {
    if (element === 'crate') return true;
    if (this.activator === PlateActivator.BOTH) return true;
    if (this.activator === PlateActivator.FIRE && element === 'fire') return true;
    if (this.activator === PlateActivator.WATER && element === 'water') return true;
    return false;
  }
}
