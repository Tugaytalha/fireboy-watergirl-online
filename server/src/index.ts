import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupSignaling } from './signaling.js';
import { getRoom, cleanupStaleRooms, getRoomCount } from './rooms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// ─── API Routes ──────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', rooms: getRoomCount() });
});

app.get('/api/rooms/:code', (req, res) => {
  const room = getRoom(req.params.code);
  if (!room) {
    res.status(404).json({ error: 'Room not found' });
    return;
  }
  res.json({
    code: room.code,
    hasHost: true,
    hasGuest: !!room.guestId,
    hostCharacter: room.hostCharacter,
  });
});

// ─── Serve static client build in production ─────────────────────────

const clientDist = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// ─── WebSocket Signaling ─────────────────────────────────────────────

setupSignaling(server);

// ─── Cleanup stale rooms every 5 minutes ─────────────────────────────

setInterval(cleanupStaleRooms, 5 * 60 * 1000);

// ─── Start server ────────────────────────────────────────────────────

const PORT = parseInt(process.env.PORT ?? '3000', 10);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
