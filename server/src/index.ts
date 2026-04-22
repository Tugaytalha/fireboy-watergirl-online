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

// ─── Security headers ─────────────────────────────────────────────────
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // modern browsers use CSP instead
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' ws: wss:; font-src 'self'; object-src 'none'; base-uri 'self'",
  );
  next();
});

// ─── CORS ─────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : null; // null = allow all in development

app.use(
  cors({
    origin: allowedOrigins
      ? (origin, cb) => {
          if (!origin || allowedOrigins.includes(origin)) cb(null, true);
          else cb(new Error('Not allowed by CORS'));
        }
      : true,
    methods: ['GET'],
  }),
);

app.use(express.json({ limit: '10kb' }));

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
