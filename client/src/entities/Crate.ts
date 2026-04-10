import Phaser from 'phaser';
import { TILE_SIZE, CRATE_PUSH_SPEED } from '@fbwg/shared';

export class Crate extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, tileX: number, tileY: number) {
    super(scene, tileX * TILE_SIZE + TILE_SIZE / 2, tileY * TILE_SIZE + TILE_SIZE / 2, 'crate');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(TILE_SIZE - 4, TILE_SIZE - 4);
    body.setDragX(300);
    body.setMaxVelocityX(CRATE_PUSH_SPEED);
    body.setCollideWorldBounds(true);
    body.pushable = true;
    body.setBounce(0);
    body.setMass(3);
  }
}
