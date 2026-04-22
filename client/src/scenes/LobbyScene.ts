import Phaser from 'phaser';
import { LEVEL_WIDTH_PX } from '@fbwg/shared';
import { NetworkManager } from '../network/NetworkManager.js';

export class LobbyScene extends Phaser.Scene {
  private statusText?: Phaser.GameObjects.Text;
  private inputText = '';
  private nm?: NetworkManager;

  constructor() {
    super({ key: 'LobbyScene' });
  }

  create() {
    this.inputText = '';
    this.nm = undefined;
    const cx = LEVEL_WIDTH_PX / 2;

    this.add
      .text(cx, 50, 'ONLINE CO-OP', {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.createButton(cx, 160, 'Create Room (Fireboy)', () => this.startCreate('fire'));
    this.createButton(cx, 220, 'Create Room (Watergirl)', () => this.startCreate('water'));
    this.createButton(cx, 280, 'Join Room', () => this.showJoinRoom());
    this.createButton(cx, 340, 'Back', () => {
      this.nm?.cleanup();
      this.scene.start('MenuScene');
    });

    this.statusText = this.add
      .text(cx, 440, '', {
        fontSize: '14px',
        color: '#aaaaaa',
        fontFamily: 'monospace',
        wordWrap: { width: LEVEL_WIDTH_PX - 40 },
        align: 'center',
      })
      .setOrigin(0.5);
  }

  private async startCreate(character: 'fire' | 'water') {
    this.statusText?.setText('Connecting to server...');
    const nm = new NetworkManager();
    this.nm = nm;

    nm.onError((msg) => this.statusText?.setText(`Error: ${msg}`));
    nm.onPeerDisconnect(() => this.statusText?.setText('Peer disconnected.'));

    try {
      await nm.connect();
    } catch {
      this.statusText?.setText('Could not reach server. Is it running?');
      return;
    }

    nm.onRoomCreated((code) => {
      this.statusText?.setText(`Room Code:\n\n${code}\n\nShare with your friend!\nWaiting for them to join...`);
    });

    nm.onRoomReady(() => {
      this.game.registry.set('networkManager', nm);
      this.scene.start('GameScene', { levelId: 1, online: true, character: nm.localCharacter });
    });

    nm.createRoom(character);
  }

  private showJoinRoom() {
    this.statusText?.setText('Type the 6-character room code and press ENTER:');
    this.inputText = '';

    const cx = LEVEL_WIDTH_PX / 2;
    const inputDisplay = this.add
      .text(cx, 490, '______', {
        fontSize: '28px',
        color: '#ffcc00',
        fontFamily: 'monospace',
        letterSpacing: 8,
      })
      .setOrigin(0.5);

    const keyHandler = async (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        this.inputText = this.inputText.slice(0, -1);
      } else if (event.key === 'Enter' && this.inputText.length === 6) {
        this.input.keyboard!.off('keydown', keyHandler);
        await this.doJoin(this.inputText);
      } else if (this.inputText.length < 6 && /^[A-Za-z0-9]$/.test(event.key)) {
        this.inputText += event.key.toUpperCase();
      }
      inputDisplay.setText(this.inputText.padEnd(6, '_'));
    };
    this.input.keyboard!.on('keydown', keyHandler);
  }

  private async doJoin(code: string) {
    this.statusText?.setText(`Connecting to room ${code}...`);
    const nm = new NetworkManager();
    this.nm = nm;

    nm.onError((msg) => this.statusText?.setText(`Error: ${msg}`));
    nm.onPeerDisconnect(() => this.statusText?.setText('Peer disconnected.'));

    try {
      await nm.connect();
    } catch {
      this.statusText?.setText('Could not reach server. Is it running?');
      return;
    }

    nm.onRoomJoined(() => {
      this.statusText?.setText(`Joined room ${code}!\nWaiting for peer connection...`);
    });

    nm.onRoomReady(() => {
      this.game.registry.set('networkManager', nm);
      this.scene.start('GameScene', { levelId: 1, online: true, character: nm.localCharacter });
    });

    nm.joinRoom(code);
  }

  private createButton(x: number, y: number, label: string, callback: () => void) {
    const bg = this.add
      .image(x, y, 'btn_bg')
      .setInteractive({ useHandCursor: true });

    const text = this.add
      .text(x, y, label, {
        fontSize: '14px',
        color: '#ffffff',
        fontFamily: 'monospace',
      })
      .setOrigin(0.5);

    bg.on('pointerover', () => text.setColor('#ffcc00'));
    bg.on('pointerout', () => text.setColor('#ffffff'));
    bg.on('pointerdown', callback);
  }
}
