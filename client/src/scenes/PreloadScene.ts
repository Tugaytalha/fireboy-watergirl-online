import Phaser from 'phaser';
import { TILE_SIZE } from '@fbwg/shared';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // ─── Loading bar ─────────────────────────────────────────────
    const { width, height } = this.scale;
    const barW = width * 0.5;
    const barH = 20;
    const barX = (width - barW) / 2;
    const barY = height / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x333333, 1);
    bg.fillRect(barX, barY, barW, barH);

    const bar = this.add.graphics();
    this.load.on('progress', (value: number) => {
      bar.clear();
      bar.fillStyle(0xff6600, 1);
      bar.fillRect(barX, barY, barW * value, barH);
    });

    const loadingText = this.add
      .text(width / 2, barY - 30, 'Loading...', {
        fontSize: '18px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.load.on('complete', () => {
      bg.destroy();
      bar.destroy();
      loadingText.destroy();
    });

    // ─── Generate all placeholder assets ─────────────────────────
    this.generateTileset();
    this.generateCharacterSprites();
    this.generateObjectSprites();
    this.generateUISprites();
    this.generateParticle();
  }

  create() {
    this.scene.start('MenuScene');
  }

  // ─── Procedural Asset Generation ─────────────────────────────────

  private generateTileset() {
    const T = TILE_SIZE;
    const cols = 10;
    const rows = 4;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Tile 0: empty (transparent)

    // Tile 1: wall (dark stone)
    g.fillStyle(0x4a4a5e);
    g.fillRect(T, 0, T, T);
    g.fillStyle(0x3d3d50);
    g.fillRect(T + 2, 2, T - 4, T - 4);

    // ── Tile 2: LAVA pool ────────────────────────────────────────────
    // Deep dark base for depth
    g.fillStyle(0x330000);
    g.fillRect(2 * T, 0, T, T);
    // Mid-tone layer
    g.fillStyle(0x881100);
    g.fillRect(2 * T, 6, T, T - 6);
    // Bright upper band (surface glow)
    g.fillStyle(0xff4400);
    g.fillRect(2 * T, 10, T, T - 10);
    // Brightest surface highlight
    g.fillStyle(0xff7700);
    g.fillRect(2 * T, 14, T, T - 14);
    // Wave bumps at the surface (5 arcs)
    g.fillStyle(0xffaa00);
    for (let i = 0; i < 5; i++) {
      g.fillRect(2 * T + i * 6 + 1, 12, 4, 4);
    }
    // Bright lava cracks (horizontal streaks)
    g.fillStyle(0xffcc00);
    g.fillRect(2 * T + 4, 18, 6, 2);
    g.fillRect(2 * T + 18, 22, 6, 2);

    // ── Tile 3: WATER pool ───────────────────────────────────────────
    // Deep dark base
    g.fillStyle(0x000b33);
    g.fillRect(3 * T, 0, T, T);
    // Mid-tone layers for depth
    g.fillStyle(0x0033aa);
    g.fillRect(3 * T, 6, T, T - 6);
    g.fillStyle(0x0055dd);
    g.fillRect(3 * T, 10, T, T - 10);
    // Surface highlight band
    g.fillStyle(0x2288ff);
    g.fillRect(3 * T, 14, T, T - 14);
    // Wave bumps at surface
    g.fillStyle(0x66bbff);
    for (let i = 0; i < 5; i++) {
      g.fillRect(3 * T + i * 6 + 1, 12, 4, 3);
    }
    // Light reflection streaks
    g.fillStyle(0x99ddff);
    g.fillRect(3 * T + 6, 18, 4, 2);
    g.fillRect(3 * T + 20, 24, 4, 2);

    // ── Tile 4: GREEN ACID pool ──────────────────────────────────────
    // Deep dark base
    g.fillStyle(0x001a00);
    g.fillRect(4 * T, 0, T, T);
    // Mid-tone layers
    g.fillStyle(0x115500);
    g.fillRect(4 * T, 6, T, T - 6);
    g.fillStyle(0x22aa00);
    g.fillRect(4 * T, 10, T, T - 10);
    // Surface highlight
    g.fillStyle(0x44dd00);
    g.fillRect(4 * T, 14, T, T - 14);
    // Bubble bumps at surface
    g.fillStyle(0x88ff44);
    for (let i = 0; i < 5; i++) {
      g.fillRect(4 * T + i * 6 + 1, 12, 4, 3);
    }
    // Toxic streak highlights
    g.fillStyle(0xbbff88);
    g.fillRect(4 * T + 5, 20, 4, 2);
    g.fillRect(4 * T + 19, 25, 4, 2);

    // Tile 5: wall variant (mossy)
    g.fillStyle(0x3a5a3a);
    g.fillRect(5 * T, 0, T, T);
    g.fillStyle(0x2d4a2d);
    g.fillRect(5 * T + 2, 2, T - 4, T - 4);

    // Tile 6: platform top
    g.fillStyle(0x6b6b7b);
    g.fillRect(6 * T, 0, T, T);
    g.fillStyle(0x888898);
    g.fillRect(6 * T, 0, T, 6);

    g.generateTexture('tileset', cols * T, rows * T);
    g.destroy();
  }

  private generateCharacterSprites() {
    const T = TILE_SIZE;

    // ─── Fireboy spritesheet (5 frames: idle, run1, run2, jump, push) ───
    const fb = this.make.graphics({ x: 0, y: 0, add: false });
    for (let i = 0; i < 5; i++) {
      // Body
      fb.fillStyle(0xff6600);
      fb.fillRect(i * T + 8, 8, 16, 20);
      // Head / flame
      fb.fillStyle(0xff3300);
      fb.fillRect(i * T + 10, 2, 12, 10);
      // Eyes
      fb.fillStyle(0xffffff);
      fb.fillRect(i * T + 11, 6, 3, 3);
      fb.fillRect(i * T + 18, 6, 3, 3);
      // Legs variation per frame
      fb.fillStyle(0xcc5500);
      if (i === 1) {
        fb.fillRect(i * T + 9, 26, 5, 4);
        fb.fillRect(i * T + 18, 24, 5, 6);
      } else if (i === 2) {
        fb.fillRect(i * T + 18, 26, 5, 4);
        fb.fillRect(i * T + 9, 24, 5, 6);
      } else {
        fb.fillRect(i * T + 10, 26, 5, 4);
        fb.fillRect(i * T + 17, 26, 5, 4);
      }
    }
    fb.generateTexture('fireboy', 5 * T, T);
    fb.destroy();
    // Register individual frame bounds so Phaser doesn't treat the full strip as one frame
    const fbTexture = this.textures.get('fireboy');
    for (let i = 0; i < 5; i++) {
      fbTexture.add(i, 0, i * T, 0, T, T);
    }

    // ─── Watergirl spritesheet (5 frames) ───
    const wg = this.make.graphics({ x: 0, y: 0, add: false });
    for (let i = 0; i < 5; i++) {
      // Body
      wg.fillStyle(0x3399ff);
      wg.fillRect(i * T + 8, 8, 16, 20);
      // Head / water ponytail
      wg.fillStyle(0x0066cc);
      wg.fillRect(i * T + 10, 2, 12, 10);
      wg.fillRect(i * T + 20, 4, 4, 8); // ponytail
      // Eyes
      wg.fillStyle(0xffffff);
      wg.fillRect(i * T + 11, 6, 3, 3);
      wg.fillRect(i * T + 18, 6, 3, 3);
      // Legs
      wg.fillStyle(0x2277cc);
      if (i === 1) {
        wg.fillRect(i * T + 9, 26, 5, 4);
        wg.fillRect(i * T + 18, 24, 5, 6);
      } else if (i === 2) {
        wg.fillRect(i * T + 18, 26, 5, 4);
        wg.fillRect(i * T + 9, 24, 5, 6);
      } else {
        wg.fillRect(i * T + 10, 26, 5, 4);
        wg.fillRect(i * T + 17, 26, 5, 4);
      }
    }
    wg.generateTexture('watergirl', 5 * T, T);
    wg.destroy();
    // Register individual frame bounds
    const wgTexture = this.textures.get('watergirl');
    for (let i = 0; i < 5; i++) {
      wgTexture.add(i, 0, i * T, 0, T, T);
    }
  }

  private generateObjectSprites() {
    const T = TILE_SIZE;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Red diamond
    g.fillStyle(0xff3333);
    g.fillTriangle(T / 2, 4, 4, T / 2, T - 4, T / 2);
    g.fillTriangle(4, T / 2, T - 4, T / 2, T / 2, T - 4);
    g.generateTexture('diamond_red', T, T);
    g.clear();

    // Blue diamond
    g.fillStyle(0x3399ff);
    g.fillTriangle(T / 2, 4, 4, T / 2, T - 4, T / 2);
    g.fillTriangle(4, T / 2, T - 4, T / 2, T / 2, T - 4);
    g.generateTexture('diamond_blue', T, T);
    g.clear();

    // Lever (left state)
    g.fillStyle(0x888888);
    g.fillRect(12, 24, 8, 8);
    g.fillStyle(0xcccccc);
    g.lineStyle(3, 0xcccccc);
    g.lineBetween(16, 24, 6, 8);
    g.generateTexture('lever_left', T, T);
    g.clear();

    // Lever (right state)
    g.fillStyle(0x888888);
    g.fillRect(12, 24, 8, 8);
    g.fillStyle(0xcccccc);
    g.lineStyle(3, 0xcccccc);
    g.lineBetween(16, 24, 26, 8);
    g.generateTexture('lever_right', T, T);
    g.clear();

    // Pressure plate
    g.fillStyle(0x999999);
    g.fillRect(2, 26, T - 4, 6);
    g.generateTexture('plate', T, T);
    g.clear();

    // Pressure plate (pressed)
    g.fillStyle(0x777777);
    g.fillRect(2, 29, T - 4, 3);
    g.generateTexture('plate_pressed', T, T);
    g.clear();

    // Crate
    g.fillStyle(0x8b6914);
    g.fillRect(2, 2, T - 4, T - 4);
    g.fillStyle(0xa07828);
    g.fillRect(4, 4, T - 8, T - 8);
    g.lineStyle(1, 0x6b5010);
    g.lineBetween(2, 2, T - 2, T - 2);
    g.lineBetween(T - 2, 2, 2, T - 2);
    g.generateTexture('crate', T, T);
    g.clear();

    // Moving platform
    g.fillStyle(0x7a7a8a);
    g.fillRect(0, 0, T * 2, 10);
    g.fillStyle(0x9a9aaa);
    g.fillRect(0, 0, T * 2, 4);
    g.generateTexture('moving_platform', T * 2, 10);
    g.clear();

    // Elevator platform
    g.fillStyle(0x6a6a7a);
    g.fillRect(0, 0, T * 2, 10);
    g.lineStyle(1, 0xaaaacc);
    g.lineBetween(0, 0, T * 2, 0);
    g.generateTexture('elevator', T * 2, 10);
    g.clear();

    // Fan base
    g.fillStyle(0x666688);
    g.fillRect(4, 4, T - 8, T - 8);
    g.fillStyle(0x8888aa);
    g.fillTriangle(T / 2, 2, 4, T - 4, T - 4, T - 4);
    g.generateTexture('fan', T, T);
    g.clear();

    // Exit door (fire)
    g.fillStyle(0xff6600);
    g.fillRect(4, 0, T - 8, T);
    g.fillStyle(0xff9933);
    g.fillRect(8, 4, T - 16, T - 4);
    g.fillStyle(0xffcc00);
    g.fillTriangle(T / 2, 2, 10, 12, T - 10, 12);
    g.generateTexture('exit_fire', T, T);
    g.clear();

    // Exit door (water)
    g.fillStyle(0x0066ff);
    g.fillRect(4, 0, T - 8, T);
    g.fillStyle(0x3399ff);
    g.fillRect(8, 4, T - 16, T - 4);
    g.fillStyle(0x66ccff);
    g.fillTriangle(T / 2, 2, 10, 12, T - 10, 12);
    g.generateTexture('exit_water', T, T);
    g.clear();

    // Door (closed)
    g.fillStyle(0x5a4a3a);
    g.fillRect(8, 0, T - 16, T * 2);
    g.lineStyle(1, 0x7a6a5a);
    g.strokeRect(10, 2, T - 20, T * 2 - 4);
    g.generateTexture('door_closed', T, T * 2);
    g.clear();

    // Door (open) — mostly transparent
    g.fillStyle(0x5a4a3a, 0.3);
    g.fillRect(8, 0, T - 16, 6);
    g.generateTexture('door_open', T, T * 2);
    g.clear();

    g.destroy();
  }

  private generateUISprites() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Button background
    g.fillStyle(0x4a3a2a);
    g.fillRoundedRect(0, 0, 200, 50, 8);
    g.fillStyle(0x6a5a4a);
    g.fillRoundedRect(2, 2, 196, 46, 6);
    g.generateTexture('btn_bg', 200, 50);
    g.clear();

    // Panel background
    g.fillStyle(0x2a2a3a, 0.9);
    g.fillRoundedRect(0, 0, 400, 300, 12);
    g.lineStyle(2, 0x6a6a8a);
    g.strokeRoundedRect(0, 0, 400, 300, 12);
    g.generateTexture('panel_bg', 400, 300);
    g.clear();

    g.destroy();
  }

  private generateParticle() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle', 8, 8);
    g.clear();

    // Fire particle
    g.fillStyle(0xff6600);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle_fire', 6, 6);
    g.clear();

    // Water particle
    g.fillStyle(0x3399ff);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle_water', 6, 6);
    g.clear();

    // Lava spark (bright orange-yellow, larger)
    g.fillStyle(0xffaa00);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particle_lava', 8, 8);
    g.clear();

    // Acid bubble (bright green)
    g.fillStyle(0x88ff44);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle_acid', 6, 6);
    g.clear();

    g.destroy();
  }
}
