import { randomInt } from 'crypto';
import { ROOM_CODE_LENGTH, ROOM_MAX_AGE_MS, RATE_LIMIT_ROOMS_PER_HOUR } from '@fbwg/shared';

export interface Room {
  code: string;
  hostId: string;
  guestId?: string;
  hostCharacter: 'fire' | 'water';
  createdAt: number;
  lastActivity: number;
}

const rooms = new Map<string, Room>();
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code: string;
  do {
    code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
      code += chars[randomInt(chars.length)];
    }
  } while (rooms.has(code));
  return code;
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= RATE_LIMIT_ROOMS_PER_HOUR) {
    return false;
  }
  entry.count++;
  return true;
}

export function createRoom(hostId: string, hostCharacter: 'fire' | 'water'): Room {
  const code = generateCode();
  const room: Room = {
    code,
    hostId,
    hostCharacter,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };
  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase());
}

export function joinRoom(code: string, guestId: string): Room | undefined {
  const room = rooms.get(code.toUpperCase());
  if (!room) return undefined;
  if (room.guestId) return undefined; // already full
  room.guestId = guestId;
  room.lastActivity = Date.now();
  return room;
}

export function removeRoom(code: string) {
  rooms.delete(code.toUpperCase());
}

export function touchRoom(code: string) {
  const room = rooms.get(code.toUpperCase());
  if (room) room.lastActivity = Date.now();
}

export function cleanupStaleRooms() {
  const now = Date.now();
  for (const [code, room] of rooms) {
    if (now - room.lastActivity > ROOM_MAX_AGE_MS) {
      rooms.delete(code);
    }
  }
}

export function getRoomCount(): number {
  return rooms.size;
}
