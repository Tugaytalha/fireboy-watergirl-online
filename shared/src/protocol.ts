// ─── Signaling Protocol (WebSocket messages) ────────────────────────

export enum SignalMessageType {
  // Client → Server
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  SIGNAL = 'signal',
  LEAVE_ROOM = 'leave_room',

  // Server → Client
  ROOM_CREATED = 'room_created',
  ROOM_JOINED = 'room_joined',
  ROOM_READY = 'room_ready',
  PEER_SIGNAL = 'peer_signal',
  PEER_DISCONNECTED = 'peer_disconnected',
  ERROR = 'error',
}

export interface SignalMessage {
  type: SignalMessageType;
  payload: Record<string, unknown>;
}

// ─── Client → Server Messages ────────────────────────────────────────

export interface CreateRoomMessage extends SignalMessage {
  type: SignalMessageType.CREATE_ROOM;
  payload: {
    hostCharacter: 'fire' | 'water';
  };
}

export interface JoinRoomMessage extends SignalMessage {
  type: SignalMessageType.JOIN_ROOM;
  payload: {
    code: string;
  };
}

export interface SignalRelayMessage extends SignalMessage {
  type: SignalMessageType.SIGNAL;
  payload: {
    signal: unknown; // WebRTC SDP or ICE candidate
  };
}

export interface LeaveRoomMessage extends SignalMessage {
  type: SignalMessageType.LEAVE_ROOM;
  payload: Record<string, never>;
}

// ─── Server → Client Messages ────────────────────────────────────────

export interface RoomCreatedMessage extends SignalMessage {
  type: SignalMessageType.ROOM_CREATED;
  payload: {
    code: string;
    hostId: string;
  };
}

export interface RoomJoinedMessage extends SignalMessage {
  type: SignalMessageType.ROOM_JOINED;
  payload: {
    code: string;
    guestId: string;
    hostCharacter: 'fire' | 'water';
  };
}

export interface RoomReadyMessage extends SignalMessage {
  type: SignalMessageType.ROOM_READY;
  payload: {
    hostId: string;
    guestId: string;
    hostCharacter: 'fire' | 'water';
  };
}

export interface PeerSignalMessage extends SignalMessage {
  type: SignalMessageType.PEER_SIGNAL;
  payload: {
    signal: unknown;
    from: string;
  };
}

export interface PeerDisconnectedMessage extends SignalMessage {
  type: SignalMessageType.PEER_DISCONNECTED;
  payload: {
    peerId: string;
  };
}

export interface ErrorMessage extends SignalMessage {
  type: SignalMessageType.ERROR;
  payload: {
    message: string;
    code: string;
  };
}
