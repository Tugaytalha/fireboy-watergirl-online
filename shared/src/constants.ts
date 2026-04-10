// ─── Tile & World Constants ───────────────────────────────────────────
export const TILE_SIZE = 32;
export const LEVEL_WIDTH_TILES = 30;
export const LEVEL_HEIGHT_TILES = 17;
export const LEVEL_WIDTH_PX = LEVEL_WIDTH_TILES * TILE_SIZE; // 960
export const LEVEL_HEIGHT_PX = LEVEL_HEIGHT_TILES * TILE_SIZE; // 544

// ─── Physics ─────────────────────────────────────────────────────────
export const GRAVITY_Y = 800;
export const PLAYER_SPEED = 160;
export const PLAYER_JUMP_VELOCITY = -420;
export const PLAYER_HITBOX_WIDTH = 20;
export const PLAYER_HITBOX_HEIGHT = 28;
export const CRATE_PUSH_SPEED = 80;
export const FAN_WIND_STRENGTH = 250;
export const MOVING_PLATFORM_DEFAULT_SPEED = 60;
export const ELEVATOR_DEFAULT_SPEED = 80;

// ─── Gameplay ────────────────────────────────────────────────────────
export const DEATH_DELAY_MS = 800;
export const RANK_A_TIME_MULTIPLIER = 1.0; // Must beat par time
export const RANK_B_TIME_MULTIPLIER = 1.5; // Must beat 1.5× par time

// ─── Networking ──────────────────────────────────────────────────────
export const ROOM_CODE_LENGTH = 6;
export const ROOM_MAX_AGE_MS = 30 * 60 * 1000; // 30 min
export const RECONNECT_TIMEOUT_MS = 30_000; // 30 sec
export const INPUT_BUFFER_MAX_FRAMES = 3;
export const INPUT_PREDICTION_THRESHOLD_MS = 100;
export const RATE_LIMIT_ROOMS_PER_HOUR = 10;

// ─── Save Key ────────────────────────────────────────────────────────
export const SAVE_KEY = 'fireboy-watergirl-save';
