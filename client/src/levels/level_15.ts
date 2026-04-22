import type { LevelData } from '@fbwg/shared';

// Level 15: Temple Escape — Final level, all mechanics
const level15: LevelData = {
  id: 15, name: 'Temple Escape', width: 30, height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) { t[y] = []; for (let x = 0; x < 30; x++) { t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0; } }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Complex layout
    for (let x = 1; x < 8; x++) t[11][x] = 1;
    for (let x = 10; x < 20; x++) t[11][x] = 1;
    for (let x = 22; x < 29; x++) t[11][x] = 1;
    for (let x = 4; x < 12; x++) t[8][x] = 1;
    for (let x = 14; x < 22; x++) t[8][x] = 1;
    for (let x = 8; x < 22; x++) t[5][x] = 1;
    for (let x = 12; x < 18; x++) t[2][x] = 1;
    // Hazard PITS (gap at y=14, hazard tile at y=15)
    t[14][8] = 0; t[15][8] = 2; t[14][9] = 0; t[15][9] = 2;   // lava
    t[14][20] = 0; t[15][20] = 3; t[14][21] = 0; t[15][21] = 3; // water
    t[14][14] = 0; t[15][14] = 4; t[14][15] = 0; t[15][15] = 4; // acid
    // Walls with doors
    for (let y = 5; y < 8; y++) t[y][8] = 1;
    for (let y = 5; y < 8; y++) t[y][21] = 1;
    for (let y = 2; y < 5; y++) t[y][12] = 1;
    for (let y = 2; y < 5; y++) t[y][17] = 1;
    return t;
  })(),
  objects: [
    { type: 'crate', x: 12, y: 10 },
    { type: 'crate', x: 16, y: 10 },
    { id: 'door_1', type: 'door', x: 8, y: 6, height: 2 },
    { id: 'door_2', type: 'door', x: 21, y: 6, height: 2 },
    { id: 'door_3', type: 'door', x: 12, y: 3, height: 2 },
    { id: 'door_4', type: 'door', x: 17, y: 3, height: 2 },
    { id: 'plate_1', type: 'pressure_plate', x: 13, y: 10, activator: 'both', targets: ['door_1'] },
    { id: 'plate_2', type: 'pressure_plate', x: 17, y: 10, activator: 'both', targets: ['door_2'] },
    { id: 'lever_1', type: 'lever', x: 6, y: 7, targets: ['door_3'] },
    { id: 'lever_2', type: 'lever', x: 18, y: 7, targets: ['door_4'] },
    { id: 'mp_1', type: 'moving_platform', x: 22, y: 7,
      path: [{ x: 22, y: 7 }, { x: 22, y: 4 }], speed: 50 },
    { id: 'fan_1', type: 'fan', x: 1, y: 13, direction: 'up', zoneLength: 4 },
  ],
  diamonds: [
    { type: 'red', x: 3, y: 10 }, { type: 'red', x: 6, y: 7 }, { type: 'red', x: 10, y: 4 }, { type: 'red', x: 14, y: 1 },
    { type: 'blue', x: 25, y: 10 }, { type: 'blue', x: 19, y: 7 }, { type: 'blue', x: 20, y: 4 }, { type: 'blue', x: 15, y: 1 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [27, 13] },
  exits: { fireboy: [14, 1], watergirl: [15, 1] },
  par: { time: 90, diamonds: { red: 4, blue: 4 } },
};
export default level15;
