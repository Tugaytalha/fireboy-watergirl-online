import Phaser from 'phaser';
import {
  PLAYER_SPEED,
  PLAYER_JUMP_VELOCITY,
  PLAYER_HITBOX_WIDTH,
  PLAYER_HITBOX_HEIGHT,
  TILE_SIZE,
} from '@fbwg/shared';
import { AnimState } from '@fbwg/shared';

export type CharacterElement = 'fire' | 'water';

export abstract class Character extends Phaser.Physics.Arcade.Sprite {
  public element: CharacterElement;
  public isAlive = true;
  public isPushing = false;
  protected speed = PLAYER_SPEED;
  protected jumpVelocity = PLAYER_JUMP_VELOCITY;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    element: CharacterElement,
  ) {
    super(scene, x, y, texture, 0);
    this.element = element;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT);
    body.setOffset(
      (TILE_SIZE - PLAYER_HITBOX_WIDTH) / 2,
      TILE_SIZE - PLAYER_HITBOX_HEIGHT,
    );
    body.setCollideWorldBounds(true);
    body.setMaxVelocityY(600);
  }

  get isOnGround(): boolean {
    return (this.body as Phaser.Physics.Arcade.Body).blocked.down;
  }

  handleInput(left: boolean, right: boolean, up: boolean) {
    if (!this.isAlive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (left) {
      body.setVelocityX(-this.speed);
      this.setFlipX(true);
    } else if (right) {
      body.setVelocityX(this.speed);
      this.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }

    if (up && this.isOnGround) {
      body.setVelocityY(this.jumpVelocity);
    }

    this.updateAnimation();
  }

  private updateAnimation() {
    if (!this.isAlive) return;

    const body = this.body as Phaser.Physics.Arcade.Body;
    const prefix = this.element === 'fire' ? 'fireboy' : 'watergirl';

    if (!this.isOnGround) {
      this.playAnim(`${prefix}_${AnimState.JUMP}`);
    } else if (this.isPushing && body.velocity.x !== 0) {
      this.playAnim(`${prefix}_${AnimState.PUSH}`);
    } else if (body.velocity.x !== 0) {
      this.playAnim(`${prefix}_${AnimState.RUN}`);
    } else {
      this.playAnim(`${prefix}_${AnimState.IDLE}`);
    }
  }

  private playAnim(key: string) {
    if (this.anims.currentAnim?.key !== key) {
      this.play(key, true);
    }
  }

  die() {
    if (!this.isAlive) return;
    this.isAlive = false;

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    body.setEnable(false);

    // Death particle burst
    const particleKey =
      this.element === 'fire' ? 'particle_fire' : 'particle_water';
    const emitter = this.scene.add.particles(this.x, this.y, particleKey, {
      speed: { min: 50, max: 150 },
      scale: { start: 1, end: 0 },
      lifespan: 500,
      quantity: 15,
      emitting: false,
    });
    emitter.explode(15);

    this.setAlpha(0.3);

    // Emit death event
    this.scene.events.emit('character-death', this.element);
  }

  reset(x: number, y: number) {
    this.isAlive = true;
    this.isPushing = false;
    this.setAlpha(1);
    this.setPosition(x, y);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setEnable(true);
    body.setAllowGravity(true);
    body.setVelocity(0, 0);
  }
}
