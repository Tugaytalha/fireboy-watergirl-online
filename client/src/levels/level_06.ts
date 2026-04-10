import type { LevelData } from '@fbwg/shared';

// Level 6: Lever Logic — Introduces levers
const level06: LevelData = {
  id: 6,
  name: 'Lever Logic',
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
    // Lower platforms
    for (let x = 2; x < 12; x++) t[11][x] = 1;
    for (let x = 18; x < 28; x++) t[11][x] = 1;
    // Upper platforms
    for (let x = 5; x < 14; x++) t[7][x] = 1;
    for (let x = 16; x < 25; x++) t[7][x] = 1;
    // Exit platform
    for (let x = 12; x < 18; x++) t[4][x] = 1;
    // Walls with door gaps
    for (let y = 4; y < 7; y++) { t[y][12] = 1; t[y][17] = 1; }
    return t;
  })(),
  objects: [
    { id: 'door_left', type: 'door', x: 12, y: 5, height: 2 },
    { id: 'door_right', type: 'door', x: 17, y: 5, height: 2 },
    { id: 'lever_1', type: 'lever', x: 6, y: 10, targets: ['door_left'] },
    { id: 'lever_2', type: 'lever', x: 22, y: 10, targets: ['door_right'] },
  ],
  diamonds: [
    { type: 'red', x: 4, y: 13 }, { type: 'red', x: 8, y: 6 },
    { type: 'blue', x: 25, y: 13 }, { type: 'blue', x: 20, y: 6 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  exits: { fireboy: [14, 3], watergirl: [15, 3] },
  par: { time: 40, diamonds: { red: 2, blue: 2 } },
};

export default level06;
