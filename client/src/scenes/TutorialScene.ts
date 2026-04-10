import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class TutorialScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TutorialScene' });
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;

    this.add.graphics().fillStyle(0x000000, 0.8).fillRect(0, 0, LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX);

    this.add
      .text(cx, 40, 'HOW TO PLAY', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const sections = [
      {
        title: 'Controls',
        lines: [
          'Fireboy: Arrow Keys (← → ↑)',
          'Watergirl: W A D keys',
          'Restart Level: R',
          'Pause: ESC',
        ],
      },
      {
        title: 'Elements',
        lines: [
          'Fireboy can walk through LAVA (orange) safely',
          'Watergirl can walk through WATER (blue) safely',
          'GREEN ACID is deadly for BOTH characters!',
        ],
      },
      {
        title: 'Objective',
        lines: [
          'Collect matching diamonds (red=Fireboy, blue=Watergirl)',
          'Use levers, pressure plates, and crates to solve puzzles',
          'Guide BOTH characters to their exit doors',
          'Both must be at their exits at the same time!',
        ],
      },
      {
        title: 'Scoring',
        lines: [
          'Rank A: Collect all diamonds + beat par time',
          'Rank B: All diamonds OR decent time',
          'Rank C: Just complete the level',
        ],
      },
    ];

    let yPos = 80;
    for (const section of sections) {
      this.add
        .text(cx, yPos, section.title, {
          fontSize: '16px',
          color: '#ffcc00',
          fontFamily: 'monospace',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
      yPos += 22;

      for (const line of section.lines) {
        this.add
          .text(cx, yPos, line, {
            fontSize: '12px',
            color: '#cccccc',
            fontFamily: 'monospace',
          })
          .setOrigin(0.5);
        yPos += 18;
      }
      yPos += 10;
    }

    // Got it button
    const btn = this.add
      .text(cx, LEVEL_HEIGHT_PX - 50, '[ Got it! ]', {
        fontSize: '18px',
        color: '#ffcc00',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    btn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
