import type { LevelData } from '@fbwg/shared';

// Level 3: Green Danger
// Introduces green acid. Three hazard pits on the ground floor.
// Characters climb a 4-step staircase to exits that are side-by-side at the top centre.
// All vertical jumps are 2–3 tiles (64–96 px), well within the 110 px physics max.
//
// Jump sequence (each side):
//   Ground y=14 → step A y=12  (2 tiles, 64 px)  ✓
//   Step A  y=12 → step B y=9   (3 tiles, 96 px)  ✓
//   Step B  y=9  → step C y=6   (3 tiles, 96 px)  ✓
//   Step C  y=6  → exit plat y=4 (2 tiles, 64 px)  ✓
//   Exit doors sit 1 tile above the exit platform (y=3), side-by-side.
//
// Exits are only 3 tiles apart — easy to reach simultaneously.
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

    // LAVA PIT  x=6–9  (Fireboy walks through safely)
    for (let x = 6; x <= 9; x++) { t[14][x] = 0; t[15][x] = 2; }
    // ACID PIT  x=13–16  (deadly for both — centre divider)
    for (let x = 13; x <= 16; x++) { t[14][x] = 0; t[15][x] = 4; }
    // WATER PIT x=20–23  (Watergirl walks through safely)
    for (let x = 20; x <= 23; x++) { t[14][x] = 0; t[15][x] = 3; }

    // ── LEFT STAIRCASE (Fireboy side) ─────────────────────────────
    // Step A: y=12, x=2–5
    for (let x = 2; x <= 5; x++) t[12][x] = 1;
    // Step B: y=9,  x=1–12
    for (let x = 1; x <= 12; x++) t[9][x] = 1;
    // Step C: y=6,  x=1–13
    for (let x = 1; x <= 13; x++) t[6][x] = 1;

    // ── RIGHT STAIRCASE (Watergirl side) ──────────────────────────
    // Step A: y=12, x=24–27
    for (let x = 24; x <= 27; x++) t[12][x] = 1;
    // Step B: y=9,  x=17–28
    for (let x = 17; x <= 28; x++) t[9][x] = 1;
    // Step C: y=6,  x=16–28
    for (let x = 16; x <= 28; x++) t[6][x] = 1;

    // ── SHARED EXIT PLATFORM ──────────────────────────────────────
    // y=4, x=10–19 — both characters climb here to trigger level end
    for (let x = 10; x <= 19; x++) t[4][x] = 1;

    return t;
  })(),
  objects: [],
  diamonds: [
    // Left side (red, for Fireboy)
    { type: 'red', x: 3, y: 11 },
    { type: 'red', x: 5, y: 8 },
    { type: 'red', x: 8, y: 5 },
    // Right side (blue, for Watergirl)
    { type: 'blue', x: 25, y: 11 },
    { type: 'blue', x: 23, y: 8 },
    { type: 'blue', x: 20, y: 5 },
  ],
  // Spawns on solid ground sections on opposite sides of the acid pit
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  // Exits side-by-side above the shared exit platform
  exits: { fireboy: [13, 3], watergirl: [16, 3] },
  par: { time: 45, diamonds: { red: 3, blue: 3 } },
};

export default level03;
