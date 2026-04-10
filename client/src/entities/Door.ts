import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';

export class Door extends Phaser.Physics.Arcade.Sprite {
  public doorId: string;
  public isOpen = false;
  private closedY: number;
  private openY: number;
  private doorHeight: number;

  constructor(
    scene: Phaser.Scene,
    tileX: number,
    tileY: number,
    id: string,
    heightTiles = 2,
  ) {
    super(
      scene,
      tileX * TILE_SIZE + TILE_SIZE / 2,
      tileY * TILE_SIZE + (heightTiles * TILE_SIZE) / 2,
      'door_closed',
    );
    this.doorId = id;
    this.doorHeight = heightTiles * TILE_SIZE;
    this.closedY = tileY * TILE_SIZE + this.doorHeight / 2;
    this.openY = this.closedY - this.doorHeight + 8;

    this.setDisplaySize(TILE_SIZE, this.doorHeight);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(TILE_SIZE - 8, this.doorHeight);
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;

    this.scene.tweens.add({
      targets: this,
      y: this.openY,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        this.setTexture('door_open');
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setEnable(false);
      },
    });
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.setTexture('door_closed');

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(true);

    this.scene.tweens.add({
      targets: this,
      y: this.closedY,
      duration: 400,
      ease: 'Power2',
    });
  }
}
