import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class GameOverScene extends Phaser.Scene {
  private levelId = 1;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { levelId: number }) {
    this.levelId = data.levelId;
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;

    this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX);

    this.add
      .text(cx, 180, 'GAME OVER', {
        fontSize: '36px',
        color: '#ff3333',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 230, 'One of the characters fell into a hazard!', {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    this.createButton(cx - 90, 300, 'Try Again', () => {
      this.scene.start('GameScene', { levelId: this.levelId });
    });
    this.createButton(cx + 90, 300, 'Quit', () => {
      this.scene.start('MenuScene');
    });
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const bg = this.add
      .image(x, y, 'btn_bg')
      .setDisplaySize(150, 45)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => text.setColor('#ffcc00'));
    bg.on('pointerout', () => text.setColor('#ffffff'));
    bg.on('pointerdown', callback);
  }
}
