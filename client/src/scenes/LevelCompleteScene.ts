import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX, Rank } from '@fbwg/shared';
import { SaveManager } from '../utils/SaveManager';

interface LevelCompleteData {
  levelId: number;
  levelName: string;
  time: number;
  redCollected: number;
  blueCollected: number;
  totalRed: number;
  totalBlue: number;
  rank: Rank;
}

export class LevelCompleteScene extends Phaser.Scene {
  private data!: LevelCompleteData;

  constructor() {
    super({ key: 'LevelCompleteScene' });
  }

  init(data: LevelCompleteData) {
    this.data = data;
  }

  create() {
    const cx = LEVEL_WIDTH_PX / 2;
    const d = this.data;

    // Save progress
    SaveManager.getInstance().completeLevel(d.levelId, d.rank);

    // Dark overlay
    this.add.graphics().fillStyle(0x000000, 0.7).fillRect(0, 0, LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX);

    // Panel
    const panelY = 80;
    this.add.image(cx, panelY + 150, 'panel_bg').setDisplaySize(420, 340);

    // Title
    this.add
      .text(cx, panelY + 20, 'LEVEL COMPLETE!', {
        fontSize: '28px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(cx, panelY + 55, `Level ${d.levelId}: ${d.levelName}`, {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    // Stats
    const min = String(Math.floor(d.time / 60)).padStart(2, '0');
    const sec = String(d.time % 60).padStart(2, '0');

    const stats = [
      `Time: ${min}:${sec}`,
      `Red Diamonds: ${d.redCollected} / ${d.totalRed}`,
      `Blue Diamonds: ${d.blueCollected} / ${d.totalBlue}`,
    ];

    stats.forEach((s, i) => {
      this.add
        .text(cx, panelY + 90 + i * 25, s, {
          fontSize: '16px',
          color: '#dddddd',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
    });

    // Rank
    const rankColors = { [Rank.A]: '#ffcc00', [Rank.B]: '#cccccc', [Rank.C]: '#cc8844' };
    this.add
      .text(cx, panelY + 180, d.rank, {
        fontSize: '64px',
        color: rankColors[d.rank],
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Buttons
    const btnY = panelY + 260;
    this.createButton(cx - 130, btnY, 'Replay', () => {
      this.scene.start('GameScene', { levelId: d.levelId });
    });
    this.createButton(cx, btnY, 'Next Level', () => {
      this.scene.start('GameScene', { levelId: d.levelId + 1 });
    });
    this.createButton(cx + 130, btnY, 'Levels', () => {
      this.scene.start('LevelSelectScene');
    });
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const bg = this.add
      .image(x, y, 'btn_bg')
      .setDisplaySize(120, 40)
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontSize: '13px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => text.setColor('#ffcc00'));
    bg.on('pointerout', () => text.setColor('#ffffff'));
    bg.on('pointerdown', callback);
  }
}
