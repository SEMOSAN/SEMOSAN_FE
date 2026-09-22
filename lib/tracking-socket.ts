import * as Sentry from "@sentry/react-native";
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
    // 모든 송수신 프레임(GPS publish 포함)이 전달되므로 프로덕션에서는 로깅하지 않음
    debug: __DEV__ ? (str) => console.log("[STOMP]", str) : () => {},
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
      Sentry.captureException(new Error(`TrackingSocketStompError: ${frame.headers['message']}`));
      callbacks?.onError?.(frame);
    },
    onWebSocketError: (e: any) => {
      console.warn('[STOMP] WS ERROR:', e?.message ?? e);
      Sentry.captureException(new Error(`TrackingSocketWebSocketError: ${e?.message ?? "unknown"}`));
      callbacks?.onError?.(e);
    },
    onWebSocketClose: (e: any) => {
      console.warn('[STOMP] WS CLOSE: code=', e?.code, 'reason=', e?.reason);
    },
  });

  return client;
}
