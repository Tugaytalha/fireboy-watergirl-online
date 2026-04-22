import type { LevelData } from '@fbwg/shared';

// Level 13: Wind Rider — Fans + moving platforms
const level13: LevelData = {
  id: 13, name: 'Wind Rider', width: 30, height: 17,
  tiles: (() => {
    const t: number[][] = [];
    for (let y = 0; y < 17; y++) { t[y] = []; for (let x = 0; x < 30; x++) { t[y][x] = (y === 0 || y === 16 || x === 0 || x === 29) ? 1 : 0; } }
    for (let x = 1; x < 29; x++) t[14][x] = 1;
    for (let x = 1; x < 6; x++) t[11][x] = 1;
    for (let x = 24; x < 29; x++) t[11][x] = 1;
    for (let x = 11; x < 19; x++) t[8][x] = 1;
    for (let x = 22; x < 28; x++) t[4][x] = 1;
    // Vast ACID PIT — crossed via fan + moving platforms
    for (let x = 6; x < 24; x++) { t[14][x] = 0; t[15][x] = 4; }
    return t;
  })(),
  objects: [
    { id: 'fan_1', type: 'fan', x: 5, y: 13, direction: 'up', zoneLength: 4 },
    { id: 'mp_1', type: 'moving_platform', x: 6, y: 10,
      path: [{ x: 6, y: 10 }, { x: 10, y: 10 }], speed: 45 },
    { id: 'mp_2', type: 'moving_platform', x: 19, y: 7,
      path: [{ x: 19, y: 7 }, { x: 23, y: 7 }], speed: 40 },
    { id: 'fan_2', type: 'fan', x: 24, y: 13, direction: 'up', zoneLength: 4 },
  ],
  diamonds: [
    { type: 'red', x: 3, y: 10 }, { type: 'red', x: 14, y: 7 }, { type: 'red', x: 25, y: 3 },
    { type: 'blue', x: 4, y: 10 }, { type: 'blue', x: 16, y: 7 }, { type: 'blue', x: 24, y: 3 },
  ],
  spawns: { fireboy: [2, 13], watergirl: [3, 13] },
  exits: { fireboy: [26, 3], watergirl: [23, 3] },
  par: { time: 60, diamonds: { red: 3, blue: 3 } },
};
export default level13;
