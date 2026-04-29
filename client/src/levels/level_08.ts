import type { LevelData } from '@fbwg/shared';

// Level 8: Crate Basics — Introduces pushable crates
const level08: LevelData = {
  id: 8,
  name: 'Crate Basics',
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
    // High ledge (needs crate to reach)
    for (let x = 8; x < 14; x++) t[10][x] = 1;
    // Higher platform
    for (let x = 16; x < 24; x++) t[7][x] = 1;
    // Exit platform
    for (let x = 22; x < 28; x++) t[4][x] = 1;
    // Wall that requires crate on plate
    for (let y = 4; y < 7; y++) t[y][22] = 1;
    return t;
  })(),
  objects: [
    { type: 'crate', x: 5, y: 13 },
    { type: 'crate', x: 18, y: 6 },
    // Door blocking exit, opened by plate under crate
    { id: 'door_1', type: 'door', x: 22, y: 5, height: 2 },
    { id: 'plate_1', type: 'pressure_plate', x: 20, y: 6, activator: 'both', targets: ['door_1'] },
  ],
  diamonds: [
    { type: 'red', x: 10, y: 9 }, { type: 'red', x: 12, y: 9 },
    { type: 'blue', x: 18, y: 13 }, { type: 'blue', x: 17, y: 6 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [5, 13] },
  exits: { fireboy: [26, 3], watergirl: [24, 3] },
  par: { time: 50, diamonds: { red: 2, blue: 2 } },
};

export default level08;
