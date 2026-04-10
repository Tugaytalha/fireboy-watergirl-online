import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CreditsScene' });
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;

    this.add
      .text(cx, 60, 'CREDITS', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const credits = [
      '',
      'Fireboy & Watergirl Online',
      '',
      'Inspired by the original Fireboy & Watergirl series',
      'by Oslo Albet (2009-2021)',
      '',
      'Built with:',
      'Phaser 3 — HTML5 Game Framework',
      'TypeScript — Programming Language',
      'PeerJS — WebRTC Library',
      'Vite — Build Tool',
      '',
      'This is a fan-made tribute project.',
      'Not affiliated with Oslo Albet.',
      '',
      'All original code and assets',
      'created from scratch.',
    ];

    credits.forEach((line, i) => {
      this.add
        .text(cx, 110 + i * 22, line, {
          fontSize: '13px',
          color: '#cccccc',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
    });

    const btn = this.add
      .text(cx, LEVEL_HEIGHT_PX - 50, '< Back', {
        fontSize: '16px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setColor('#ffffff'));
    btn.on('pointerout', () => btn.setColor('#aaaaaa'));
    btn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
