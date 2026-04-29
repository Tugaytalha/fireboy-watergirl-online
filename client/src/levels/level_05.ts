import type { LevelData } from '@fbwg/shared';

// Level 5: Press & Pass — Introduces pressure plates and doors
const level05: LevelData = {
  id: 5,
  name: 'Press & Pass',
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
    // Ground floor
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    // Left stepping stone: ground y=14 → y=12 → y=10 (each 2-tile hop)
    for (let x = 2; x < 6; x++) t[12][x] = 1;
    // Right stepping stone: Watergirl spawns right, needs same 2-hop path
    for (let x = 24; x < 28; x++) t[12][x] = 1;
    // Wall divider with door opening
    for (let y = 3; y < 14; y++) t[y][15] = 1;
    // Left area platforms
    for (let x = 2; x < 14; x++) t[10][x] = 1;
    for (let x = 3; x < 10; x++) t[7][x] = 1;
    // Right area platforms
    for (let x = 17; x < 28; x++) t[10][x] = 1;
    for (let x = 20; x < 27; x++) t[7][x] = 1;
    // Exit platform
    for (let x = 22; x < 28; x++) t[4][x] = 1;
    return t;
  })(),
  objects: [
    // Door in the wall divider at x=15, y=11 (2 tiles tall gap)
    { id: 'door_1', type: 'door', x: 15, y: 11, height: 3 },
    // Pressure plate (fire-colored, for Fireboy)
    { id: 'plate_1', type: 'pressure_plate', x: 5, y: 9, activator: 'fire', targets: ['door_1'] },
    // Second door blocking exit
    { id: 'door_2', type: 'door', x: 22, y: 8, height: 2 },
    // Pressure plate for second door (water)
    { id: 'plate_2', type: 'pressure_plate', x: 20, y: 9, activator: 'water', targets: ['door_2'] },
  ],
  diamonds: [
    { type: 'red', x: 8, y: 13 },
    { type: 'red', x: 12, y: 9 },
    { type: 'blue', x: 20, y: 13 },
    { type: 'blue', x: 24, y: 9 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [26, 13] },
  exits: { fireboy: [26, 3], watergirl: [24, 3] },
  par: { time: 45, diamonds: { red: 2, blue: 2 } },
};

export default level05;
