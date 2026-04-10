import type { LevelData } from '@fbwg/shared';

// Level 3: Green Danger — Introduces green acid
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
        if (y === 0 || y === 16 || x === 0 || x === 29) {
          t[y][x] = 1;
        } else {
          t[y][x] = 0;
        }
      }
    }
    // Ground floor
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Green acid pit in the middle — must jump over
    for (let x = 12; x < 16; x++) t[13][x] = 4; // green acid
    // Left lava section (Fireboy crosses here)
    for (let x = 6; x < 9; x++) t[13][x] = 2;
    // Right water section (Watergirl crosses here)
    for (let x = 20; x < 23; x++) t[13][x] = 3;
    // Platforms
    for (let x = 3; x < 12; x++) t[10][x] = 1;
    for (let x = 16; x < 27; x++) t[10][x] = 1;
    // Upper exit area
    for (let x = 22; x < 28; x++) t[5][x] = 1;
    for (let x = 16; x < 23; x++) t[7][x] = 1;
    return t;
  })(),
  objects: [],
  diamonds: [
    { type: 'red', x: 7, y: 12 },
    { type: 'blue', x: 21, y: 12 },
    { type: 'red', x: 5, y: 9 },
    { type: 'blue', x: 18, y: 9 },
    { type: 'red', x: 24, y: 9 },
    { type: 'blue', x: 25, y: 9 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  exits: { fireboy: [26, 4], watergirl: [23, 4] },
  par: { time: 45, diamonds: { red: 3, blue: 3 } },
};

export default level03;
