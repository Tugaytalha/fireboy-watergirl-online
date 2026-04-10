// ─── Tile Types ──────────────────────────────────────────────────────
export enum TileType {
  EMPTY = 0,
  WALL = 1,
  LAVA = 2,
  WATER = 3,
  GREEN_ACID = 4,
}

// ─── Element Types ───────────────────────────────────────────────────
export enum Element {
  FIRE = 'fire',
  WATER = 'water',
}

// ─── Object Types (placed in level JSON "objects" array) ─────────────
export enum ObjectType {
  DOOR = 'door',
  LEVER = 'lever',
  PRESSURE_PLATE = 'pressure_plate',
  MOVING_PLATFORM = 'moving_platform',
  ELEVATOR = 'elevator',
  CRATE = 'crate',
  FAN = 'fan',
  EXIT_FIRE = 'exit_fire',
  EXIT_WATER = 'exit_water',
}

// ─── Pressure Plate Subtypes ─────────────────────────────────────────
export enum PlateActivator {
  FIRE = 'fire',
  WATER = 'water',
  BOTH = 'both',
}

// ─── Fan Directions ──────────────────────────────────────────────────
export enum FanDirection {
  UP = 'up',
  LEFT = 'left',
  RIGHT = 'right',
}

// ─── Character Animation States ──────────────────────────────────────
export enum AnimState {
  IDLE = 'idle',
  RUN = 'run',
  JUMP = 'jump',
  DEATH = 'death',
  PUSH = 'push',
}

// ─── Rank ────────────────────────────────────────────────────────────
export enum Rank {
  A = 'A',
  B = 'B',
  C = 'C',
}

// ─── Level Data Interfaces ───────────────────────────────────────────
export interface Vec2 {
  x: number;
  y: number;
}

export interface LevelDiamond {
  type: 'red' | 'blue';
  x: number;
  y: number;
}

export interface LevelObject {
  id?: string;
  type: ObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  // Moving platform / elevator
  path?: Vec2[];
  speed?: number;
  // Lever / pressure plate targets
  targets?: string[];
  // Pressure plate activator type
  activator?: PlateActivator;
  // Fan direction
  direction?: FanDirection;
  // Fan wind zone size (tiles)
  zoneLength?: number;
}

export interface LevelPar {
  time: number; // seconds
  diamonds: { red: number; blue: number };
}

export interface LevelData {
  id: number;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  objects: LevelObject[];
  diamonds: LevelDiamond[];
  spawns: { fireboy: [number, number]; watergirl: [number, number] };
  exits: { fireboy: [number, number]; watergirl: [number, number] };
  par: LevelPar;
}

// ─── Save Data ───────────────────────────────────────────────────────
export interface SaveData {
  unlockedLevel: number;
  bestRanks: Record<number, Rank>;
  settings: {
    musicVolume: number;
    sfxVolume: number;
  };
}

// ─── Multiplayer ─────────────────────────────────────────────────────
export interface RoomInfo {
  code: string;
  hostId: string;
  guestId?: string;
  hostCharacter: Element;
  createdAt: number;
  lastActivity: number;
}

export interface PlayerInput {
  frame: number;
  left: boolean;
  right: boolean;
  up: boolean;
}

export interface GameEvent {
  type: GameEventType;
  payload?: unknown;
}

export enum GameEventType {
  LEVEL_START = 'level_start',
  LEVEL_COMPLETE = 'level_complete',
  DEATH = 'death',
  RESTART = 'restart',
  PAUSE = 'pause',
  RESUME = 'resume',
  SELECT_LEVEL = 'select_level',
}
