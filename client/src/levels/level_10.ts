import type { LevelData } from '@fbwg/shared';

// Level 10: Gusty Halls — Introduces fans/wind
const level10: LevelData = {
  id: 10,
  name: 'Gusty Halls',
  width: 30,
  height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) {
      t[y] = [];
      for (let x = 0; x < 30; x++) {
        if (y === 0 || y === 16 || x === 0 || x === 29) t[y][x] = 1;
        else t[y][x] = 0;
      }
    }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // ACID PIT (gap in ground + hazard tile below)
    for (let x = 10; x < 20; x++) { t[14][x] = 0; t[15][x] = 4; }
    // Platforms at different heights
    for (let x = 1; x < 10; x++) t[10][x] = 1;
    for (let x = 20; x < 29; x++) t[10][x] = 1;
    for (let x = 12; x < 18; x++) t[7][x] = 1;
    // Right-side intermediate step: right platform y=10 → step y=7 → exit y=4 (each 3 tiles ✓)
    // Without this, right-platform y=10 → exit y=4 = 6 tiles which is impossible
    for (let x = 20; x < 28; x++) t[7][x] = 1;
    // Exit area
    for (let x = 22; x < 28; x++) t[4][x] = 1;
    return t;
  })(),
  objects: [
    // Fan at bottom left blowing UP to help jump across
    { id: 'fan_1', type: 'fan', x: 9, y: 13, direction: 'up', zoneLength: 5 },
    // Fan on middle platform blowing RIGHT
    { id: 'fan_2', type: 'fan', x: 12, y: 6, direction: 'right', zoneLength: 6 },
  ],
  diamonds: [
    { type: 'red', x: 5, y: 9 }, { type: 'red', x: 14, y: 6 },
    { type: 'red', x: 25, y: 3 },
    { type: 'blue', x: 7, y: 9 }, { type: 'blue', x: 16, y: 6 },
    { type: 'blue', x: 24, y: 3 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [4, 13] },
  exits: { fireboy: [26, 3], watergirl: [23, 3] },
  par: { time: 50, diamonds: { red: 3, blue: 3 } },
};

export default level10;
