---
applyTo: '**'
---
# Fireboy & Watergirl Online — Copilot Instructions

## Project Overview
Cooperative puzzle-platformer (Fireboy & Watergirl) with online co-op via WebRTC P2P.
**Monorepo** with three npm workspaces: `client/`, `server/`, `shared/`.

## Tech Stack
| Layer | Technology |
|---|---|
| Client | Phaser.js 3, TypeScript, Vite |
| Server | Node.js, Express, `ws` (WebSocket) |
| Shared | TypeScript types, constants, protocol |
| Multiplayer | PeerJS (WebRTC P2P data channels) |
| Physics | Phaser Arcade Physics (AABB, gravity) |
| Build | npm workspaces, Vite (client), `tsx` (server dev) |

## Directory Structure
```
/
├── client/src/
│   ├── entities/        # Game objects (Character, Diamond, Door, …)
│   ├── levels/          # Level data (level_01.ts … level_15.ts)
│   ├── network/         # NetworkManager (WebRTC/PeerJS)
│   ├── scenes/          # Phaser scenes (GameScene, MenuScene, …)
│   ├── ui/              # HUD
│   └── utils/           # SaveManager, RankCalculator
├── server/src/
│   ├── index.ts         # Express entry point
│   ├── rooms.ts         # In-memory room store + rate limiting
│   └── signaling.ts     # WebSocket signaling server
└── shared/src/
    ├── constants.ts     # Physics, networking, gameplay constants
    ├── types.ts         # Shared TypeScript types/enums
    └── protocol.ts      # WebSocket message types
```

## Coding Conventions
- **TypeScript strict mode** across all packages — no `any` without justification.
- **ESM modules** — always use `.js` extensions in import paths (even for `.ts` source files).
- **Named exports** only — no default exports except Phaser Scene classes.
- **Shared constants** live in `shared/src/constants.ts`. Never hardcode magic numbers.
- **Shared types** live in `shared/src/types.ts`. Import from `@fbwg/shared`.
- **No secrets in code** — use `process.env.VARIABLE_NAME`. See `.env.example`.

## Game Mechanics (do not break these)
- Fireboy: arrow keys, dies in water/acid, safe in lava. Red diamonds.
- Watergirl: WASD, dies in lava/acid, safe in water. Blue diamonds.
- Both must stand on their exit doors simultaneously to complete a level.
- Tile types: `EMPTY=0 WALL=1 LAVA=2 WATER=3 GREEN_ACID=4` (see `TileType` enum).
- Level grid: 30×17 tiles @ 32px = 960×544px canvas.

## Security Rules
- **CORS**: restricted by `ALLOWED_ORIGINS` env var in production.
- **Room codes**: use `crypto.randomInt()` — never `Math.random()`.
- **WebSocket messages**: validate size (≤4 KB) and shape (`type: string`, `payload: object`) before processing.
- **Error responses**: generic messages to clients, detailed errors to server logs only.
- **Rate limiting**: room creation is rate-limited per IP (10/hour). REST endpoints are read-only GET.
- **JSON body size**: capped at 10 KB via `express.json({ limit: '10kb' })`.

## Level Design Pattern
Each level file exports a `LevelData` object. Use tile integer constants from `TileType`.
Objects array holds interactive elements (diamonds, levers, doors, plates, platforms, etc.).

## Running Locally
```bash
# Refresh PATH first (Windows)
$env:Path = "C:\Program Files\nodejs;" + $env:Path

# Client dev server (port 5173, proxies /api and /ws to port 3000)
npx --workspace=client vite --port 5173

# Server dev (port 3000)
npx --workspace=server tsx src/index.ts
```
