import { ActiveRide, MatchCandidate } from '../types';

export type RealtimeEventType =
  | 'RIDE_UPDATED'
  | 'MATCH_CANDIDATE_FOUND'
  | 'MATCH_ACCEPTED'
  | 'MATCH_REJECTED'
  | 'DRIVER_LOCATION_PING'
  | 'STOP_COMPLETED'
  | 'RIDE_COMPLETED'
  | 'NEW_PASSENGER_BROADCAST';

export interface RealtimeMessage {
  type: RealtimeEventType;
  payload: any;
  senderId: string;
  timestamp: number;
}

type MessageHandler = (message: RealtimeMessage) => void;

class RealtimeService {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<RealtimeEventType, Set<MessageHandler>> = new Map();
  private clientId: string;

  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('rideshare_realtime_bus');
        this.channel.onmessage = (event) => {
          this.handleIncoming(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported or restricted, fallback to in-memory bus', err);
      }
    }
  }

  public subscribe(eventType: RealtimeEventType, handler: MessageHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  public broadcast(type: RealtimeEventType, payload: any) {
    const msg: RealtimeMessage = {
      type,
      payload,
      senderId: this.clientId,
      timestamp: Date.now()
    };

    // 1. Dispatch locally in current window
    this.handleIncoming(msg);

    // 2. Dispatch across other windows / tabs / devices
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {
        console.warn('Failed to broadcast message', e);
      }
    }
  }

  private handleIncoming(message: RealtimeMessage) {
    const handlers = this.listeners.get(message.type);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(message);
        } catch (e) {
          console.error('Error in realtime listener', e);
        }
      });
    }
  }

  public getClientId(): string {
    return this.clientId;
  }
}

export const realtimeService = new RealtimeService();
