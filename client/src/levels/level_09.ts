import type { LevelData } from '@fbwg/shared';

// Level 9: Elevator Up — Introduces elevators
const level09: LevelData = {
  id: 9,
  name: 'Elevator Up',
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
    // Left area
    for (let x = 1; x < 10; x++) t[11][x] = 1;
    // Right upper platforms
    for (let x = 18; x < 28; x++) t[8][x] = 1;
    for (let x = 22; x < 28; x++) t[4][x] = 1;
    // Elevator shaft walls
    t[11][14] = 1; t[11][16] = 1;
    t[10][14] = 1; t[10][16] = 1;
    t[9][14] = 1; t[9][16] = 1;
    t[8][14] = 1; t[8][16] = 1;
    return t;
  })(),
  objects: [
    // Elevator activated by plate
    { id: 'elev_1', type: 'elevator', x: 14, y: 12,
      path: [{ x: 15, y: 12 }, { x: 15, y: 7 }], speed: 60 },
    { id: 'plate_1', type: 'pressure_plate', x: 5, y: 10,
      activator: 'both', targets: ['elev_1'] },
  ],
  diamonds: [
    { type: 'red', x: 3, y: 13 }, { type: 'red', x: 20, y: 7 },
    { type: 'red', x: 25, y: 3 },
    { type: 'blue', x: 8, y: 13 }, { type: 'blue', x: 22, y: 7 },
    { type: 'blue', x: 24, y: 3 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [4, 13] },
  exits: { fireboy: [26, 3], watergirl: [23, 3] },
  par: { time: 50, diamonds: { red: 3, blue: 3 } },
};

export default level09;
