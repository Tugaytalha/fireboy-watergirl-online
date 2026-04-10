import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class PauseScene extends Phaser.Scene {
  private levelId = 1;

  constructor() {
    super({ key: 'PauseScene' });
  }

  init(data: { levelId: number }) {
    this.levelId = data.levelId;
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;

    this.add.graphics().fillStyle(0x000000, 0.6).fillRect(0, 0, LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX);

    this.add
      .text(cx, 150, 'PAUSED', {
        fontSize: '36px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const buttons = [
      { label: 'Resume', action: () => { this.scene.resume('GameScene'); this.scene.stop(); } },
      { label: 'Restart', action: () => { this.scene.stop(); this.scene.start('GameScene', { levelId: this.levelId }); } },
      { label: 'Settings', action: () => this.scene.start('SettingsScene', { returnTo: 'PauseScene' }) },
      { label: 'Quit to Menu', action: () => { this.scene.stop('GameScene'); this.scene.start('MenuScene'); } },
    ];

    buttons.forEach((btn, i) => {
      this.createButton(cx, 220 + i * 55, btn.label, btn.action);
    });

    // ESC to resume
    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const bg = this.add
      .image(x, y, 'btn_bg')
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
