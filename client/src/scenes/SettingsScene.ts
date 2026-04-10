import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';
import { SaveManager } from '../utils/SaveManager';

export class SettingsScene extends Phaser.Scene {
  private musicVolume = 0.7;
  private sfxVolume = 0.8;

  constructor() {
    super({ key: 'SettingsScene' });
  }

  create() {
    const save = SaveManager.getInstance();
    this.musicVolume = save.settings.musicVolume;
    this.sfxVolume = save.settings.sfxVolume;

    const cx = LEVEL_WIDTH_PX / 2;

    this.add
      .text(cx, 60, 'SETTINGS', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Music volume
    this.add
      .text(cx - 120, 150, 'Music Volume', {
        fontSize: '16px',
        color: '#dddddd',
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0.5);

    this.createSlider(cx + 80, 150, this.musicVolume, (val) => {
      this.musicVolume = val;
    });

    // SFX volume
    this.add
      .text(cx - 120, 210, 'SFX Volume', {
        fontSize: '16px',
        color: '#dddddd',
        fontFamily: 'monospace',
      })
      .setOrigin(0, 0.5);

    this.createSlider(cx + 80, 210, this.sfxVolume, (val) => {
      this.sfxVolume = val;
    });

    // Controls reference
    this.add
      .text(cx, 290, 'Controls', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    const controls = [
      'Fireboy: Arrow Keys (←→↑)',
      'Watergirl: W A D',
      'Restart: R',
      'Pause: ESC',
    ];
    controls.forEach((c, i) => {
      this.add
        .text(cx, 320 + i * 22, c, {
          fontSize: '13px',
          color: '#aaaaaa',
          fontFamily: 'monospace',
        })
        .setOrigin(0.5);
    });

    // Back button
    this.createTextButton(cx, LEVEL_HEIGHT_PX - 60, 'Save & Back', () => {
      save.updateSettings(this.musicVolume, this.sfxVolume);
      this.scene.start('MenuScene');
    });
  }

  private createSlider(x: number, y: number, initialValue: number, onChange: (val: number) => void) {
    const width = 150;
    const bg = this.add.graphics();
    bg.fillStyle(0x333333);
    bg.fillRect(x - width / 2, y - 3, width, 6);

    const fill = this.add.graphics();
    const handle = this.add.circle(x - width / 2 + initialValue * width, y, 8, 0xffcc00)
      .setInteractive({ useHandCursor: true, draggable: true });

    const drawFill = (val: number) => {
      fill.clear();
      fill.fillStyle(0xff6600);
      fill.fillRect(x - width / 2, y - 3, val * width, 6);
    };
    drawFill(initialValue);

    this.input.setDraggable(handle);
    handle.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number) => {
      const minX = x - width / 2;
      const maxX = x + width / 2;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);
      handle.x = clampedX;
      const val = (clampedX - minX) / width;
      drawFill(val);
      onChange(val);
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

    text.on('pointerover', () => text.setColor('#ffcc00'));
    text.on('pointerout', () => text.setColor('#aaaaaa'));
    text.on('pointerdown', callback);
  }
}
