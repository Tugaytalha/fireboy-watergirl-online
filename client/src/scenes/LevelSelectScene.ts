import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX, Rank } from '@fbwg/shared';
import { SaveManager } from '../utils/SaveManager';
import { levels } from '../levels';

export class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
  }

  create() {
    const save = SaveManager.getInstance();
    const cx = LEVEL_WIDTH_PX / 2;

    this.add
      .text(cx, 30, 'SELECT LEVEL', {
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Grid of level buttons
    const cols = 5;
    const btnSize = 70;
    const padding = 15;
    const startX = cx - ((cols * (btnSize + padding)) - padding) / 2 + btnSize / 2;
    const startY = 80;

    levels.forEach((level, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = startX + col * (btnSize + padding);
      const y = startY + row * (btnSize + padding);
      const levelNum = index + 1;
      const isUnlocked = levelNum <= save.unlockedLevel;
      const bestRank = save.getBestRank(levelNum);

      this.createLevelButton(x, y, btnSize, levelNum, isUnlocked, bestRank);
    });

    // Back button
    this.createTextButton(80, LEVEL_HEIGHT_PX - 40, '< Back', () => {
      this.scene.start('MenuScene');
    });
  }

  private createLevelButton(
    x: number,
    y: number,
    size: number,
    level: number,
    unlocked: boolean,
    rank?: Rank,
  ) {
    const bg = this.add.graphics();
    if (unlocked) {
      bg.fillStyle(0x4a3a2a, 1);
      bg.fillRoundedRect(x - size / 2, y - size / 2, size, size, 6);
      bg.lineStyle(2, 0x8a7a6a);
      bg.strokeRoundedRect(x - size / 2, y - size / 2, size, size, 6);
    } else {
      bg.fillStyle(0x2a2a2a, 0.6);
      bg.fillRoundedRect(x - size / 2, y - size / 2, size, size, 6);
    }

    const text = this.add
      .text(x, y - 8, String(level), {
        fontSize: '20px',
        color: unlocked ? '#ffffff' : '#555555',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    if (rank) {
      const rankColors = { [Rank.A]: '#ffcc00', [Rank.B]: '#cccccc', [Rank.C]: '#cc8844' };
      this.add
        .text(x, y + 16, rank, {
          fontSize: '14px',
          color: rankColors[rank],
          fontFamily: 'monospace',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    }

    if (!unlocked) {
      this.add
        .text(x, y + 14, '🔒', { fontSize: '14px' })
        .setOrigin(0.5);
      return;
    }

    // Interaction zone
    const zone = this.add
      .zone(x, y, size, size)
      .setInteractive({ useHandCursor: true });

    zone.on('pointerover', () => {
      text.setColor('#ffcc00');
    });
    zone.on('pointerout', () => {
      text.setColor('#ffffff');
    });
    zone.on('pointerdown', () => {
      this.scene.start('GameScene', { levelId: level });
    });
  }

  private createTextButton(x: number, y: number, label: string, callback: () => void) {
    const text = this.add
      .text(x, y, label, {
        fontSize: '16px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    text.on('pointerover', () => text.setColor('#ffffff'));
    text.on('pointerout', () => text.setColor('#aaaaaa'));
    text.on('pointerdown', callback);
  }
}
