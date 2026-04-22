import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage } from 'http';
import type { Server } from 'http';
import { SignalMessageType } from '@fbwg/shared';
import {
  createRoom,
  joinRoom,
  getRoom,
  removeRoom,
  touchRoom,
  checkRateLimit,
} from './rooms.js';

interface Client {
  ws: WebSocket;
  id: string;
  roomCode?: string;
  ip: string;
}

const clients = new Map<string, Client>();
let clientIdCounter = 0;
const MAX_WS_MESSAGE_BYTES = 4096;

function generateClientId(): string {
  return `client_${++clientIdCounter}_${Date.now().toString(36)}`;
}

function send(ws: WebSocket, type: SignalMessageType, payload: Record<string, unknown>) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

export function setupSignaling(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const clientId = generateClientId();
    const ip = getClientIp(req);
    const client: Client = { ws, id: clientId, ip };
    clients.set(clientId, client);

    ws.on('message', (data) => {
      try {
        const raw = data.toString();
        if (Buffer.byteLength(raw, 'utf8') > MAX_WS_MESSAGE_BYTES) {
          send(ws, SignalMessageType.ERROR, { message: 'Message too large', code: 'MESSAGE_TOO_LARGE' });
          return;
        }
        const msg = JSON.parse(raw);
        if (typeof msg.type !== 'string' || (msg.payload !== undefined && typeof msg.payload !== 'object')) {
          send(ws, SignalMessageType.ERROR, { message: 'Invalid message format', code: 'INVALID_FORMAT' });
          return;
        }
        handleMessage(client, msg);
      } catch {
        send(ws, SignalMessageType.ERROR, { message: 'Invalid message format', code: 'INVALID_FORMAT' });
      }
    });

    ws.on('close', () => {
      handleDisconnect(client);
      clients.delete(clientId);
    });

    ws.on('error', () => {
      handleDisconnect(client);
      clients.delete(clientId);
    });
  });
}

function handleMessage(client: Client, msg: { type: string; payload: Record<string, unknown> }) {
  switch (msg.type) {
    case SignalMessageType.CREATE_ROOM:
      handleCreateRoom(client, msg.payload);
      break;
    case SignalMessageType.JOIN_ROOM:
      handleJoinRoom(client, msg.payload);
      break;
    case SignalMessageType.SIGNAL:
      handleSignalRelay(client, msg.payload);
      break;
    case SignalMessageType.LEAVE_ROOM:
      handleLeaveRoom(client);
      break;
  }
}

function handleCreateRoom(client: Client, payload: Record<string, unknown>) {
  if (!checkRateLimit(client.ip)) {
    send(client.ws, SignalMessageType.ERROR, {
      message: 'Rate limit exceeded. Try again later.',
      code: 'RATE_LIMITED',
    });
    return;
  }

  const hostCharacter = (payload.hostCharacter as string) === 'water' ? 'water' : 'fire';
  const room = createRoom(client.id, hostCharacter);
  client.roomCode = room.code;

  send(client.ws, SignalMessageType.ROOM_CREATED, {
    code: room.code,
    hostId: client.id,
  });
}

function handleJoinRoom(client: Client, payload: Record<string, unknown>) {
  const code = String(payload.code ?? '').toUpperCase();
  if (!code || code.length !== 6) {
    send(client.ws, SignalMessageType.ERROR, {
      message: 'Invalid room code',
      code: 'INVALID_CODE',
    });
    return;
  }

  const room = joinRoom(code, client.id);
  if (!room) {
    send(client.ws, SignalMessageType.ERROR, {
      message: 'Room not found or full',
      code: 'ROOM_NOT_FOUND',
    });
    return;
  }

  client.roomCode = room.code;

  // Notify guest
  send(client.ws, SignalMessageType.ROOM_JOINED, {
    code: room.code,
    guestId: client.id,
    hostCharacter: room.hostCharacter,
  });

  // Notify host that room is ready
  const host = findClientById(room.hostId);
  if (host) {
    send(host.ws, SignalMessageType.ROOM_READY, {
      hostId: room.hostId,
      guestId: client.id,
      hostCharacter: room.hostCharacter,
    });
  }

  // Also tell guest room is ready
  send(client.ws, SignalMessageType.ROOM_READY, {
    hostId: room.hostId,
    guestId: client.id,
    hostCharacter: room.hostCharacter,
  });
}

function handleSignalRelay(client: Client, payload: Record<string, unknown>) {
  if (!client.roomCode) return;
  const room = getRoom(client.roomCode);
  if (!room) return;

  touchRoom(client.roomCode);

  // Find the peer (the other person in the room)
  const peerId = room.hostId === client.id ? room.guestId : room.hostId;
  if (!peerId) return;

  const peer = findClientById(peerId);
  if (peer) {
    send(peer.ws, SignalMessageType.PEER_SIGNAL, {
      signal: payload.signal,
      from: client.id,
    });
  }
}

function handleLeaveRoom(client: Client) {
  handleDisconnect(client);
}

function handleDisconnect(client: Client) {
  if (!client.roomCode) return;
  const room = getRoom(client.roomCode);
  if (!room) return;

  // Notify peer
  const peerId = room.hostId === client.id ? room.guestId : room.hostId;
  if (peerId) {
    const peer = findClientById(peerId);
    if (peer) {
      send(peer.ws, SignalMessageType.PEER_DISCONNECTED, { peerId: client.id });
    }
  }

  // If host disconnects, remove room. If guest, just clear guest slot.
  if (room.hostId === client.id) {
    removeRoom(client.roomCode);
  } else {
    room.guestId = undefined;
  }

  client.roomCode = undefined;
}

function findClientById(id: string): Client | undefined {
  return clients.get(id) ?? [...clients.values()].find((c) => c.id === id);
}
