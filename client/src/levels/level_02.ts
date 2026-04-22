import type { LevelData } from '@fbwg/shared';

// Level 2: Elemental Paths — Lava and water pools, characters must take safe routes
const level02: LevelData = {
  id: 2,
  name: 'Elemental Paths',
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
    // LAVA PIT (left path, x=5-8): gap in ground + hazard tile below
    for (let x = 5; x < 9; x++) { t[14][x] = 0; t[15][x] = 2; }
    // WATER PIT (right path, x=15-18)
    for (let x = 15; x < 19; x++) { t[14][x] = 0; t[15][x] = 3; }
    // Upper platform for exits
    for (let x = 22; x < 28; x++) t[8][x] = 1;
    // Mid-step left (y=11, 3 tiles above ground — within max jump 110px)
    for (let x = 3; x < 10; x++) t[11][x] = 1;
    // Mid-step right
    for (let x = 14; x < 22; x++) t[11][x] = 1;
    // Bridge to exit
    for (let x = 19; x < 25; x++) t[9][x] = 1;
    return t;
  })(),
  objects: [],
  diamonds: [
    { type: 'red', x: 7, y: 12 },
    { type: 'red', x: 6, y: 10 },
    { type: 'blue', x: 17, y: 12 },
    { type: 'blue', x: 16, y: 10 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [4, 13] },
  exits: { fireboy: [26, 7], watergirl: [23, 7] },
  par: { time: 40, diamonds: { red: 2, blue: 2 } },
};

export default level02;
