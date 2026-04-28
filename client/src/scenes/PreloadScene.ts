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

    // ── Tile 0: empty background (subtle dark fill so pits read clearly) ─
    g.fillStyle(0x0a0a14);
    g.fillRect(0, 0, T, T);

    // ── Tile 1: WALL — stone brick with mortar lines ─────────────────────
    // Base stone colour
    g.fillStyle(0x50506a);
    g.fillRect(T, 0, T, T);
    // Lighter face
    g.fillStyle(0x5c5c78);
    g.fillRect(T + 1, 1, T - 2, T - 2);
    // Brick pattern: two rows of bricks, alternating horizontal offset
    g.fillStyle(0x3a3a50); // mortar / shadow
    g.fillRect(T, 8, T, 1);   // horizontal mortar line mid-tile
    g.fillRect(T, 0, 1, 8);   // vertical mortar, top row left-aligned
    g.fillRect(T + 16, 0, 1, 8); // top row right brick joint
    g.fillRect(T + 8, 9, 1, T - 9); // bottom row middle joint (offset)
    g.fillRect(T + 24, 9, 1, T - 9);
    // Top highlight edge
    g.fillStyle(0x7878a0);
    g.fillRect(T + 1, 1, T - 2, 2);
    g.fillRect(T + 1, 1, 2, 6);

    // ── Tile 2: LAVA pit bottom — viewed from above ───────────────────────
    // The TOP of the tile = liquid surface (brightest), BOTTOM = deep/dark
    // Deep molten black base
    g.fillStyle(0x0f0000);
    g.fillRect(2 * T, 0, T, T);
    // Dark red mid-depth band
    g.fillStyle(0x550000);
    g.fillRect(2 * T, 0, T, 22);
    // Orange-red rising from below
    g.fillStyle(0xcc2200);
    g.fillRect(2 * T, 0, T, 14);
    // Bright orange surface zone
    g.fillStyle(0xff5500);
    g.fillRect(2 * T, 0, T, 8);
    // Hottest surface skin
    g.fillStyle(0xff8800);
    g.fillRect(2 * T, 0, T, 4);
    // Surface glowing veins (bright spots across top)
    g.fillStyle(0xffdd00);
    g.fillRect(2 * T + 3,  1, 4, 2);
    g.fillRect(2 * T + 12, 2, 3, 2);
    g.fillRect(2 * T + 22, 1, 5, 2);
    g.fillRect(2 * T + 8,  3, 3, 1);
    g.fillRect(2 * T + 18, 3, 4, 1);
    // Deep crack lines down the tile (bright thin lines)
    g.fillStyle(0xff6600);
    g.fillRect(2 * T + 6,  6, 1, 18);
    g.fillRect(2 * T + 20, 8, 1, 16);
    g.fillRect(2 * T + 13, 10, 1, 14);
    // Deepest pool glow at bottom
    g.fillStyle(0x881100);
    g.fillRect(2 * T + 2, 24, T - 4, 6);
    g.fillStyle(0x330000);
    g.fillRect(2 * T + 4, 28, T - 8, 4);

    // ── Tile 3: WATER pit bottom — viewed from above ──────────────────────
    g.fillStyle(0x000510);
    g.fillRect(3 * T, 0, T, T);
    // Dark deep-ocean mid layers
    g.fillStyle(0x001540);
    g.fillRect(3 * T, 0, T, 22);
    g.fillStyle(0x002b88);
    g.fillRect(3 * T, 0, T, 14);
    // Lighter surface
    g.fillStyle(0x0055cc);
    g.fillRect(3 * T, 0, T, 8);
    // Surface skin
    g.fillStyle(0x1177ee);
    g.fillRect(3 * T, 0, T, 4);
    // Bright surface glints (light reflection)
    g.fillStyle(0x99eeff);
    g.fillRect(3 * T + 4,  1, 5, 2);
    g.fillRect(3 * T + 16, 2, 4, 2);
    g.fillRect(3 * T + 25, 1, 4, 2);
    g.fillRect(3 * T + 10, 3, 3, 1);
    // Ripple circles (painted as ellipse-like rects)
    g.fillStyle(0x2299dd);
    g.fillRect(3 * T + 8,  8, 8, 1);
    g.fillRect(3 * T + 7,  9, 10, 1);
    g.fillRect(3 * T + 8, 10, 8, 1);
    g.fillRect(3 * T + 18, 14, 6, 1);
    g.fillRect(3 * T + 17, 15, 8, 1);
    g.fillRect(3 * T + 18, 16, 6, 1);
    // Deepest bottom
    g.fillStyle(0x001030);
    g.fillRect(3 * T + 4, 26, T - 8, 6);

    // ── Tile 4: GREEN ACID pit bottom — viewed from above ─────────────────
    g.fillStyle(0x000f00);
    g.fillRect(4 * T, 0, T, T);
    g.fillStyle(0x012200);
    g.fillRect(4 * T, 0, T, 22);
    g.fillStyle(0x035500);
    g.fillRect(4 * T, 0, T, 14);
    // Toxic surface
    g.fillStyle(0x22aa00);
    g.fillRect(4 * T, 0, T, 8);
    g.fillStyle(0x44cc00);
    g.fillRect(4 * T, 0, T, 4);
    // Surface sheen spots
    g.fillStyle(0xccff44);
    g.fillRect(4 * T + 3,  1, 4, 2);
    g.fillRect(4 * T + 14, 2, 5, 2);
    g.fillRect(4 * T + 23, 1, 4, 2);
    g.fillRect(4 * T + 9,  3, 3, 1);
    // Bubble outlines mid-pool
    g.fillStyle(0x55ee00);
    g.fillRect(4 * T + 6,  9, 5, 1);
    g.fillRect(4 * T + 5, 10, 7, 1);
    g.fillRect(4 * T + 6, 11, 5, 1);
    g.fillRect(4 * T + 19, 15, 4, 1);
    g.fillRect(4 * T + 18, 16, 6, 1);
    g.fillRect(4 * T + 19, 17, 4, 1);
    // Deep murky bottom
    g.fillStyle(0x011500);
    g.fillRect(4 * T + 4, 26, T - 8, 6);

    // ── Tile 5: wall variant (mossy, for variety) ─────────────────────────
    g.fillStyle(0x3a5a3a);
    g.fillRect(5 * T, 0, T, T);
    g.fillStyle(0x2d4a2d);
    g.fillRect(5 * T + 2, 2, T - 4, T - 4);
    g.fillStyle(0x4a7a4a);
    g.fillRect(5 * T + 1, 1, T - 2, 2);

    // ── Tile 6: platform top ──────────────────────────────────────────────
    g.fillStyle(0x5a5a70);
    g.fillRect(6 * T, 0, T, T);
    g.fillStyle(0x787898);
    g.fillRect(6 * T, 0, T, 5);
    g.fillStyle(0x9090b8);
    g.fillRect(6 * T, 0, T, 2);

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
