import Peer, { DataConnection } from 'peerjs';
import { SignalMessageType } from '@fbwg/shared';
import type { PlayerInput, GameEvent } from '@fbwg/shared';

type MessageHandler = (data: unknown) => void;

export class NetworkManager {
  private ws: WebSocket | null = null;
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;

  private clientId = '';
  private roomCode = '';
  private isHost = false;
  private hostCharacter: 'fire' | 'water' = 'fire';

  // Callbacks
  private onRoomCreatedCb?: (code: string) => void;
  private onRoomJoinedCb?: (hostCharacter: 'fire' | 'water') => void;
  private onRoomReadyCb?: (hostCharacter: 'fire' | 'water') => void;
  private onPeerInputCb?: (input: PlayerInput) => void;
  private onPeerEventCb?: (event: GameEvent) => void;
  private onPeerDisconnectCb?: () => void;
  private onErrorCb?: (msg: string) => void;

  // ─── Signaling Server Connection ─────────────────────────────────

  connect(serverUrl?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = serverUrl ?? `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}/ws`;
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => resolve();
      this.ws.onerror = () => reject(new Error('WebSocket connection failed'));
      this.ws.onclose = () => {
        this.onPeerDisconnectCb?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleSignalingMessage(msg);
        } catch {
          // ignore parse errors
        }
      };
    });
  }

  private sendWs(type: SignalMessageType, payload: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  // ─── Room Management ──────────────────────────────────────────────

  createRoom(hostCharacter: 'fire' | 'water' = 'fire') {
    this.isHost = true;
    this.hostCharacter = hostCharacter;
    this.sendWs(SignalMessageType.CREATE_ROOM, { hostCharacter });
  }

  joinRoom(code: string) {
    this.isHost = false;
    this.sendWs(SignalMessageType.JOIN_ROOM, { code: code.toUpperCase() });
  }

  leaveRoom() {
    this.sendWs(SignalMessageType.LEAVE_ROOM, {});
    this.cleanup();
  }

  // ─── Signaling Message Handler ────────────────────────────────────

  private handleSignalingMessage(msg: { type: string; payload: Record<string, unknown> }) {
    switch (msg.type) {
      case SignalMessageType.ROOM_CREATED:
        this.clientId = msg.payload.hostId as string;
        this.roomCode = msg.payload.code as string;
        this.onRoomCreatedCb?.(this.roomCode);
        break;

      case SignalMessageType.ROOM_JOINED:
        this.roomCode = msg.payload.code as string;
        this.hostCharacter = msg.payload.hostCharacter as 'fire' | 'water';
        this.onRoomJoinedCb?.(this.hostCharacter);
        break;

      case SignalMessageType.ROOM_READY:
        this.hostCharacter = msg.payload.hostCharacter as 'fire' | 'water';
        this.onRoomReadyCb?.(this.hostCharacter);
        this.setupPeerConnection(msg.payload.hostId as string, msg.payload.guestId as string);
        break;

      case SignalMessageType.PEER_SIGNAL:
        // Relay ICE/SDP to PeerJS (handled internally by PeerJS via signaling)
        break;

      case SignalMessageType.PEER_DISCONNECTED:
        this.onPeerDisconnectCb?.();
        break;

      case SignalMessageType.ERROR:
        this.onErrorCb?.(msg.payload.message as string);
        break;
    }
  }

  // ─── PeerJS WebRTC ────────────────────────────────────────────────

  private setupPeerConnection(hostId: string, guestId: string) {
    const myId = this.isHost ? `fbwg_${hostId}` : `fbwg_${guestId}`;
    const peerId = this.isHost ? `fbwg_${guestId}` : `fbwg_${hostId}`;

    this.peer = new Peer(myId, {
      debug: 0,
    });

    this.peer.on('open', () => {
      if (this.isHost) {
        // Host initiates connection to guest
        this.conn = this.peer!.connect(peerId, { reliable: false });
        this.setupDataConnection(this.conn);
      }
    });

    this.peer.on('connection', (conn) => {
      // Guest receives connection from host
      this.conn = conn;
      this.setupDataConnection(conn);
    });

    this.peer.on('error', (err) => {
      this.onErrorCb?.(err.message);
    });
  }

  private setupDataConnection(conn: DataConnection) {
    conn.on('open', () => {
      // Connection established
    });

    conn.on('data', (data) => {
      const msg = data as { type: string; payload: unknown };
      if (msg.type === 'input') {
        this.onPeerInputCb?.(msg.payload as PlayerInput);
      } else if (msg.type === 'event') {
        this.onPeerEventCb?.(msg.payload as GameEvent);
      }
    });

    conn.on('close', () => {
      this.onPeerDisconnectCb?.();
    });

    conn.on('error', () => {
      this.onPeerDisconnectCb?.();
    });
  }

  // ─── Send Data ────────────────────────────────────────────────────

  sendInput(input: PlayerInput) {
    this.conn?.send({ type: 'input', payload: input });
  }

  sendGameEvent(event: GameEvent) {
    this.conn?.send({ type: 'event', payload: event });
  }

  // ─── Event Listeners ──────────────────────────────────────────────

  onRoomCreated(cb: (code: string) => void) { this.onRoomCreatedCb = cb; }
  onRoomJoined(cb: (hostCharacter: 'fire' | 'water') => void) { this.onRoomJoinedCb = cb; }
  onRoomReady(cb: (hostCharacter: 'fire' | 'water') => void) { this.onRoomReadyCb = cb; }
  onPeerInput(cb: (input: PlayerInput) => void) { this.onPeerInputCb = cb; }
  onPeerEvent(cb: (event: GameEvent) => void) { this.onPeerEventCb = cb; }
  onPeerDisconnect(cb: () => void) { this.onPeerDisconnectCb = cb; }
  onError(cb: (msg: string) => void) { this.onErrorCb = cb; }

  // ─── Getters ──────────────────────────────────────────────────────

  get isConnected(): boolean {
    return this.conn?.open ?? false;
  }

  get localCharacter(): 'fire' | 'water' {
    if (this.isHost) return this.hostCharacter;
    return this.hostCharacter === 'fire' ? 'water' : 'fire';
  }

  get currentRoomCode(): string {
    return this.roomCode;
  }

  // ─── Cleanup ──────────────────────────────────────────────────────

  cleanup() {
    this.conn?.close();
    this.peer?.destroy();
    this.ws?.close();
    this.conn = null;
    this.peer = null;
    this.ws = null;
  }

  destroy() {
    this.cleanup();
  }
}
