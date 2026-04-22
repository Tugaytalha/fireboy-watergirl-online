import type { LevelData } from '@fbwg/shared';

// Level 11: Combined Forces — Plates + Levers + Doors
const level11: LevelData = {
  id: 11, name: 'Combined Forces', width: 30, height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) { t[y] = []; for (let x = 0; x < 30; x++) { t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0; } }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Stepping stones: ground→y=12→y=10 on both sides (direct 4-tile jump is impossible)
    for (let x = 2; x < 6; x++) t[12][x] = 1;   // left, near Fireboy spawn
    for (let x = 24; x < 28; x++) t[12][x] = 1;  // right, near Watergirl spawn
    for (let x = 1; x < 14; x++) t[10][x] = 1;
    for (let x = 16; x < 29; x++) t[10][x] = 1;
    for (let x = 4; x < 12; x++) t[7][x] = 1;
    for (let x = 18; x < 26; x++) t[7][x] = 1;
    for (let x = 10; x < 20; x++) t[4][x] = 1;
    for (let y = 4; y < 7; y++) { t[y][10] = 1; t[y][19] = 1; }
    for (let x = 14; x < 16; x++) t[13][x] = 4;
    return t;
  })(),
  objects: [
    { id: 'door_l', type: 'door', x: 10, y: 5, height: 2 },
    { id: 'door_r', type: 'door', x: 19, y: 5, height: 2 },
    { id: 'lever_1', type: 'lever', x: 6, y: 9, targets: ['door_l'] },
    { id: 'plate_1', type: 'pressure_plate', x: 22, y: 9, activator: 'water', targets: ['door_r'] },
  ],
  diamonds: [
    { type: 'red', x: 4, y: 13 }, { type: 'red', x: 8, y: 6 }, { type: 'red', x: 14, y: 3 },
    { type: 'blue', x: 25, y: 13 }, { type: 'blue', x: 20, y: 6 }, { type: 'blue', x: 16, y: 3 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  exits: { fireboy: [13, 3], watergirl: [16, 3] },
  par: { time: 55, diamonds: { red: 3, blue: 3 } },
};
export default level11;
