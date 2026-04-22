import type { LevelData } from '@fbwg/shared';

// Level 14: The Maze — Multiple paths, all hazard types
const level14: LevelData = {
  id: 14, name: 'The Maze', width: 30, height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) { t[y] = []; for (let x = 0; x < 30; x++) { t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0; } }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Vertical dividers
    for (let y = 2; y < 14; y++) { t[y][10] = 1; t[y][20] = 1; }
    // Gaps in dividers
    t[8][10] = 0; t[9][10] = 0;
    t[5][20] = 0; t[6][20] = 0;
    t[11][20] = 0; t[12][20] = 0;
    // Platforms
    for (let x = 1; x < 10; x++) t[11][x] = 1;
    for (let x = 1; x < 10; x++) t[7][x] = 1;
    for (let x = 11; x < 20; x++) t[11][x] = 1;
    for (let x = 11; x < 20; x++) t[7][x] = 1;
    for (let x = 21; x < 29; x++) t[9][x] = 1;
    for (let x = 21; x < 29; x++) t[4][x] = 1;
    // Hazard PITS (gap at y=14, hazard tile at y=15)
    for (let x = 3; x < 7; x++) { t[14][x] = 0; t[15][x] = 2; }  // lava
    for (let x = 13; x < 17; x++) { t[14][x] = 0; t[15][x] = 3; } // water
    t[14][23] = 0; t[15][23] = 4; t[14][24] = 0; t[15][24] = 4;   // acid
    return t;
  })(),
  objects: [
    { id: 'door_1', type: 'door', x: 10, y: 7, height: 2 },
    { id: 'lever_1', type: 'lever', x: 15, y: 10, targets: ['door_1'] },
  ],
  diamonds: [
    { type: 'red', x: 5, y: 12 }, { type: 'red', x: 3, y: 6 }, { type: 'red', x: 15, y: 6 }, { type: 'red', x: 25, y: 3 },
    { type: 'blue', x: 15, y: 12 }, { type: 'blue', x: 7, y: 6 }, { type: 'blue', x: 18, y: 6 }, { type: 'blue', x: 24, y: 3 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [4, 13] },
  exits: { fireboy: [27, 3], watergirl: [22, 3] },
  par: { time: 65, diamonds: { red: 4, blue: 4 } },
};
export default level14;
