import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;
    const cy = LEVEL_HEIGHT_PX / 2;

    // Title
    this.add
      .text(cx, 80, 'FIREBOY & WATERGIRL', {
        fontSize: '36px',
        color: '#ff6600',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, 120, 'ONLINE', {
        fontSize: '24px',
        color: '#3399ff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Animated characters (simple bouncing sprites)
    const fb = this.add.sprite(cx - 80, 200, 'fireboy', 0);
    const wg = this.add.sprite(cx + 80, 200, 'watergirl', 0);
    this.tweens.add({ targets: fb, y: 190, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: wg, y: 190, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 500 });

    // Buttons
    const buttons = [
      { label: 'Play', scene: 'LevelSelectScene' },
      { label: 'Online Co-op', scene: 'LobbyScene' },
      { label: 'How to Play', scene: 'TutorialScene' },
      { label: 'Settings', scene: 'SettingsScene' },
      { label: 'Credits', scene: 'CreditsScene' },
    ];

    buttons.forEach((btn, i) => {
      this.createButton(cx, 280 + i * 50, btn.label, () => {
        this.scene.start(btn.scene);
      });
    });
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const bg = this.add.image(x, y, 'btn_bg').setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontSize: '16px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => {
      bg.setTint(0xdddddd);
      text.setColor('#ffcc00');
    });
    bg.on('pointerout', () => {
      bg.clearTint();
      text.setColor('#ffffff');
    });
    bg.on('pointerdown', callback);
  }
}
