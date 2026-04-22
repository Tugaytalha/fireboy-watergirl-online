import type { LevelData } from '@fbwg/shared';

// Level 7: Moving Ride — Introduces moving platforms
const level07: LevelData = {
  id: 7,
  name: 'Moving Ride',
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
    // Left ledge
    for (let x = 1; x < 8; x++) t[10][x] = 1;
    // Stepping stone so chars can reach left ledge y=10
    for (let x = 2; x < 6; x++) t[12][x] = 1;
    // Right ledge
    for (let x = 22; x < 29; x++) t[10][x] = 1;
    // Exit platform (top right)
    for (let x = 22; x < 28; x++) t[5][x] = 1;
    // Small middle ledge
    for (let x = 13; x < 17; x++) t[8][x] = 1;
    // ACID PIT below the gap: gap in ground + hazard tile
    for (let x = 8; x < 22; x++) { t[14][x] = 0; t[15][x] = 4; }
    return t;
  })(),
  objects: [
    // Moving platform across the acid gap
    {
      id: 'mp_1', type: 'moving_platform',
      x: 8, y: 9,
      path: [{ x: 8, y: 9 }, { x: 20, y: 9 }],
      speed: 50,
    },
    // Vertical moving platform to exit
    {
      id: 'mp_2', type: 'moving_platform',
      x: 19, y: 8,
      path: [{ x: 19, y: 8 }, { x: 19, y: 4 }],
      speed: 40,
    },
  ],
  diamonds: [
    { type: 'red', x: 4, y: 9 }, { type: 'red', x: 14, y: 7 },
    { type: 'blue', x: 6, y: 9 }, { type: 'blue', x: 15, y: 7 },
    { type: 'red', x: 25, y: 4 }, { type: 'blue', x: 24, y: 4 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [4, 13] },
  exits: { fireboy: [26, 4], watergirl: [23, 4] },
  par: { time: 55, diamonds: { red: 3, blue: 3 } },
};

export default level07;
