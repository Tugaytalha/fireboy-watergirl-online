import type { LevelData } from '@fbwg/shared';

// Level 12: Crate & Plate — Push crate onto plate to hold door open
const level12: LevelData = {
  id: 12, name: 'Crate & Plate', width: 30, height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) { t[y] = []; for (let x = 0; x < 30; x++) { t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0; } }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    for (let x = 1; x < 15; x++) t[10][x] = 1;
    // Stepping stone so chars can reach left y=10 platform (ground→y=12→y=10, each 2 tiles)
    for (let x = 2; x < 6; x++) t[12][x] = 1;
    for (let x = 18; x < 29; x++) t[10][x] = 1;
    // Intermediate platform: right side y=8 so chars can reach y=6 exit area (y=10→y=8→y=6, each 2 tiles)
    for (let x = 21; x < 28; x++) t[8][x] = 1;
    for (let x = 20; x < 28; x++) t[6][x] = 1;
    for (let y = 6; y < 10; y++) t[y][20] = 1;
    for (let x = 15; x < 18; x++) t[13][x] = 4;
    return t;
  })(),
  objects: [
    { type: 'crate', x: 8, y: 9 },
    { id: 'door_1', type: 'door', x: 20, y: 7, height: 3 },
    { id: 'plate_1', type: 'pressure_plate', x: 12, y: 9, activator: 'both', targets: ['door_1'] },
  ],
  diamonds: [
    { type: 'red', x: 4, y: 13 }, { type: 'red', x: 10, y: 9 }, { type: 'red', x: 24, y: 5 },
    { type: 'blue', x: 6, y: 13 }, { type: 'blue', x: 22, y: 9 }, { type: 'blue', x: 26, y: 5 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [3, 13] },
  exits: { fireboy: [25, 5], watergirl: [23, 5] },
  par: { time: 50, diamonds: { red: 3, blue: 3 } },
};
export default level12;
