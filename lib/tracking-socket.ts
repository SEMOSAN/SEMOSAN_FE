import { Client } from '@stomp/stompjs';
import { tokenStorage } from './auth/tokenStorage';

const WS_URL = process.env.EXPO_PUBLIC_API_URL!
  .replace(/^https/, 'wss')
  .replace(/^http/, 'ws') + '/ws/tracking';

export type TrackingSocketCallbacks = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
};

export async function createTrackingStompClient(
  callbacks?: TrackingSocketCallbacks,
): Promise<Client> {
  const accessToken = await tokenStorage.getAccessToken();

  const client = new Client({
    webSocketFactory: () => new WebSocket(WS_URL),
    appendMissingNULLonIncoming: true,
    forceBinaryWSFrames: true,
    connectHeaders: accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {},
    heartbeatIncoming: 0,
    heartbeatOutgoing: 0,
    reconnectDelay: 5000,
    debug: (str) => console.log('[STOMP]', str),
    onConnect: () => {
      console.log('[STOMP] CONNECTED ✓');
      callbacks?.onConnect?.();
    },
    onDisconnect: () => {
      console.log('[STOMP] 연결 해제됨');
      callbacks?.onDisconnect?.();
    },
    onStompError: (frame) => {
      console.warn('[STOMP] STOMP ERROR:', frame.headers['message'], frame.body);
      callbacks?.onError?.(frame);
    },
    onWebSocketError: (e: any) => {
      console.warn('[STOMP] WS ERROR:', e?.message ?? e);
      callbacks?.onError?.(e);
    },
    onWebSocketClose: (e: any) => {
      console.warn('[STOMP] WS CLOSE: code=', e?.code, 'reason=', e?.reason);
    },
  });

  return client;
}
