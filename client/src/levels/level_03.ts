import type { LevelData } from '@fbwg/shared';

// Level 3: Green Danger
// Introduces green acid. Three hazard pits on the ground floor.
//
// Path (both characters):
//   Ground y=14 → stepping stone y=12  (2 tiles = 64 px)  ✓
//   Stepping stone y=12 → side platform y=9  (3 tiles = 96 px)  ✓
//   Side platform y=9 → CENTER BRIDGE y=6   (3 tiles = 96 px)  ✓
//   Center bridge y=6 → exit platform y=3   (3 tiles = 96 px)  ✓
//
// The CENTER BRIDGE (y=6, x=5–24) is the key: it is one continuous platform
// that BOTH characters must reach. From there they jump together to the exits
// side-by-side at the top centre. There is no disconnected gap at this level.
const level03: LevelData = {
  id: 3,
  name: 'Green Danger',
  width: 30,
  height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) {
      t[y] = [];
      for (let x = 0; x < 30; x++) {
        t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0;
      }
    }

    // ── Ground floor (gaps become hazard pits) ─────────────────────
    for (let x = 1; x < 29; x++) t[14][x] = 1;

    // LAVA PIT  x=5–9   (Fireboy safe, Watergirl must avoid)
    for (let x = 5; x <= 9; x++) { t[14][x] = 0; t[15][x] = 2; }
    // ACID PIT  x=12–17  (deadly for both)
    for (let x = 12; x <= 17; x++) { t[14][x] = 0; t[15][x] = 4; }
    // WATER PIT x=20–24  (Watergirl safe, Fireboy must avoid)
    for (let x = 20; x <= 24; x++) { t[14][x] = 0; t[15][x] = 3; }

    // ── LEFT STEPPING STONE ────────────────────────────────────────
    // y=12, x=1–4: 2-tile jump from ground ✓
    for (let x = 1; x <= 4; x++) t[12][x] = 1;

    // ── RIGHT STEPPING STONE ───────────────────────────────────────
    // y=12, x=25–28: 2-tile jump from ground ✓
    for (let x = 25; x <= 28; x++) t[12][x] = 1;

    // ── LEFT PLATFORM ──────────────────────────────────────────────
    // y=9, x=1–13: 3-tile jump from left stepping stone ✓
    for (let x = 1; x <= 13; x++) t[9][x] = 1;

    // ── RIGHT PLATFORM ─────────────────────────────────────────────
    // y=9, x=16–28: 3-tile jump from right stepping stone ✓
    for (let x = 16; x <= 28; x++) t[9][x] = 1;

    // ── CENTER BRIDGE ──────────────────────────────────────────────
    // y=6, x=5–24: 3-tile jump from either side platform ✓
    // Single continuous platform — both characters meet here.
    // From x=10–19 on this bridge, jump 3 tiles up to reach exit platform.
    for (let x = 5; x <= 24; x++) t[6][x] = 1;

    // ── EXIT PLATFORM ──────────────────────────────────────────────
    // y=3, x=10–19: 3-tile jump from center bridge ✓
    for (let x = 10; x <= 19; x++) t[3][x] = 1;

    return t;
  })(),
  objects: [],
  diamonds: [
    // Left side (red, for Fireboy) — placed above each platform
    { type: 'red', x: 2, y: 11 },
    { type: 'red', x: 6, y: 8 },
    { type: 'red', x: 9, y: 5 },
    // Right side (blue, for Watergirl) — placed above each platform
    { type: 'blue', x: 27, y: 11 },
    { type: 'blue', x: 22, y: 8 },
    { type: 'blue', x: 19, y: 5 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  // Exits side-by-side 1 tile above the exit platform
  exits: { fireboy: [13, 2], watergirl: [16, 2] },
  par: { time: 45, diamonds: { red: 3, blue: 3 } },
};

export default level03;
