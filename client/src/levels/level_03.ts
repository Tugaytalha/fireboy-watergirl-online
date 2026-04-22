import type { LevelData } from '@fbwg/shared';

// Level 3: Green Danger — Introduces green acid pits; each side has a safe hazard + shared acid barrier
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

    // ── Ground floor (full, gaps added below for pits) ──────────────
    for (let x = 1; x < 29; x++) t[14][x] = 1;

    // ── LAVA PIT (left, x=6-8): Fireboy can fall in safely, Watergirl must jump ──
    for (let x = 6; x <= 8; x++) { t[14][x] = 0; t[15][x] = 2; }

    // ── ACID PIT (centre, x=13-16): deadly for both — divides sides ──────
    for (let x = 13; x <= 16; x++) { t[14][x] = 0; t[15][x] = 4; }

    // ── WATER PIT (right, x=21-23): Watergirl can fall in safely, Fireboy must jump ──
    for (let x = 21; x <= 23; x++) { t[14][x] = 0; t[15][x] = 3; }

    // ── LEFT STAIRCASE (Fireboy's path to left exit) ──────────────────
    // Step 1  y=12, x=2-4   (2-tile jump from ground y=14)
    for (let x = 2; x <= 4; x++) t[12][x] = 1;
    // Step 2  y=10, x=1-7   (2-tile jump from step 1)
    for (let x = 1; x <= 7; x++) t[10][x] = 1;
    // Step 3  y=7,  x=1-9   (3-tile jump from step 2, within 110 px max)
    for (let x = 1; x <= 9; x++) t[7][x] = 1;
    // Exit platform y=4, x=1-8
    for (let x = 1; x <= 8; x++) t[4][x] = 1;

    // ── RIGHT STAIRCASE (Watergirl's path to right exit) ──────────────
    // Step 1  y=12, x=24-27
    for (let x = 24; x <= 27; x++) t[12][x] = 1;
    // Step 2  y=10, x=21-28
    for (let x = 21; x <= 28; x++) t[10][x] = 1;
    // Step 3  y=7,  x=19-28
    for (let x = 19; x <= 28; x++) t[7][x] = 1;
    // Exit platform y=4, x=20-28
    for (let x = 20; x <= 28; x++) t[4][x] = 1;

    return t;
  })(),
  objects: [],
  diamonds: [
    // Left staircase diamonds (red for Fireboy)
    { type: 'red', x: 3, y: 11 },
    { type: 'red', x: 4, y: 9 },
    { type: 'red', x: 6, y: 6 },
    // Right staircase diamonds (blue for Watergirl)
    { type: 'blue', x: 25, y: 11 },
    { type: 'blue', x: 24, y: 9 },
    { type: 'blue', x: 22, y: 6 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [26, 13] },
  exits: { fireboy: [4, 3], watergirl: [24, 3] },
  par: { time: 50, diamonds: { red: 3, blue: 3 } },
};

export default level03;
