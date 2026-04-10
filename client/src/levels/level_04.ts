import type { LevelData } from '@fbwg/shared';

// Level 4: Diamond Collector — Teaches diamond collection
const level04: LevelData = {
  id: 4,
  name: 'Diamond Collector',
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
    // Ground
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Left side platforms (Fireboy's diamond route)
    for (let x = 2; x < 8; x++) t[11][x] = 1;
    for (let x = 4; x < 10; x++) t[8][x] = 1;
    for (let x = 2; x < 7; x++) t[5][x] = 1;
    // Right side platforms (Watergirl's diamond route)
    for (let x = 22; x < 28; x++) t[11][x] = 1;
    for (let x = 20; x < 26; x++) t[8][x] = 1;
    for (let x = 23; x < 28; x++) t[5][x] = 1;
    // Center bridge to exits
    for (let x = 10; x < 20; x++) t[3][x] = 1;
    // Steps to center bridge
    for (let x = 7; x < 12; x++) t[5][x] = 1;
    for (let x = 18; x < 24; x++) t[5][x] = 1;
    return t;
  })(),
  objects: [],
  diamonds: [
    // Fireboy's diamonds (left)
    { type: 'red', x: 3, y: 10 },
    { type: 'red', x: 6, y: 7 },
    { type: 'red', x: 4, y: 4 },
    { type: 'red', x: 9, y: 4 },
    // Watergirl's diamonds (right)
    { type: 'blue', x: 25, y: 10 },
    { type: 'blue', x: 22, y: 7 },
    { type: 'blue', x: 26, y: 4 },
    { type: 'blue', x: 20, y: 4 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  exits: { fireboy: [13, 2], watergirl: [16, 2] },
  par: { time: 50, diamonds: { red: 4, blue: 4 } },
};

export default level04;
