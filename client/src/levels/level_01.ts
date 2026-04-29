import type { LevelData } from '@fbwg/shared';

// Level 1: First Steps — Movement only, no hazards
const level01: LevelData = {
  id: 1,
  name: 'First Steps',
  width: 30,
  height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) {
      t[y] = [];
      for (let x = 0; x < 30; x++) {
        if (y === 0 || y === 16 || x === 0 || x === 29) {
          t[y][x] = 1; // Wall border
        } else {
          t[y][x] = 0; // Empty
        }
      }
    }
    // Floor platform at y=14
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Upper platform (exit area)
    for (let x = 20; x < 28; x++) t[8][x] = 1;
    // Step to upper
    for (let x = 14; x < 20; x++) t[11][x] = 1;
    // Small step
    for (let x = 10; x < 15; x++) t[13][x] = 1;
    return t;
  })(),
  objects: [],
  diamonds: [
    { type: 'red', x: 8, y: 12 },
    { type: 'blue', x: 12, y: 12 },
    { type: 'red', x: 16, y: 10 },
    { type: 'blue', x: 18, y: 10 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [26, 13] },
  exits: { fireboy: [25, 7], watergirl: [22, 7] },
  par: { time: 30, diamonds: { red: 2, blue: 2 } },
};

export default level01;
