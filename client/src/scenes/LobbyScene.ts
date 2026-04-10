import Phaser from 'phaser';
import { LEVEL_WIDTH_PX, LEVEL_HEIGHT_PX } from '@fbwg/shared';

export class LobbyScene extends Phaser.Scene {
  private roomCodeText?: Phaser.GameObjects.Text;
  private statusText?: Phaser.GameObjects.Text;
  private inputText = '';
  private mode: 'menu' | 'create' | 'join' = 'menu';

  constructor() {
    super({ key: 'LobbyScene' });
  }

  create() {
    this.mode = 'menu';
    this.inputText = '';
    const cx = LEVEL_WIDTH_PX / 2;

    this.add
      .text(cx, 50, 'ONLINE CO-OP', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.createButton(cx, 160, 'Create Room', () => this.showCreateRoom());
    this.createButton(cx, 230, 'Join Room', () => this.showJoinRoom());
    this.createButton(cx, 300, 'Back', () => this.scene.start('MenuScene'));

    this.statusText = this.add
      .text(cx, 400, '', {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);
  }

  private showCreateRoom() {
    // Generate a random room code (client-side demo; real one from server)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    this.statusText?.setText(`Room Code: ${code}\nShare this code with your friend!\n\nWaiting for player...`);

    // TODO: integrate with NetworkManager for real signaling
  }

  private showJoinRoom() {
    this.statusText?.setText('Enter room code:\n(Use keyboard to type, press ENTER to join)');
    this.inputText = '';

    const inputDisplay = this.add
      .text(LEVEL_WIDTH_PX / 2, 440, '______', {
        fontSize: '28px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        letterSpacing: 8,
      })
      .setOrigin(0.5);

    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        this.inputText = this.inputText.slice(0, -1);
      } else if (event.key === 'Enter' && this.inputText.length === 6) {
        this.statusText?.setText(`Connecting to room ${this.inputText}...`);
        // TODO: integrate with NetworkManager
      } else if (this.inputText.length < 6 && /^[A-Za-z0-9]$/.test(event.key)) {
        this.inputText += event.key.toUpperCase();
      }
      const display = this.inputText.padEnd(6, '_');
      inputDisplay.setText(display);
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
