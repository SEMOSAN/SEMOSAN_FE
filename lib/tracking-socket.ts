import { Client } from '@stomp/stompjs';
import { tokenStorage } from './auth/tokenStorage';

const WS_URL = process.env.EXPO_PUBLIC_API_URL!.replace(/^https/, 'wss').replace(/^http/, 'ws') + '/ws/tracking';

export type TrackingSocketCallbacks = {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: unknown) => void;
};

export function createTrackingStompClient(callbacks?: TrackingSocketCallbacks): Client {
  const client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('[TrackingSocket] 연결됨');
      callbacks?.onConnect?.();
    },
    onDisconnect: () => {
      console.log('[TrackingSocket] 연결 해제됨');
      callbacks?.onDisconnect?.();
    },
    onStompError: (frame) => {
      console.warn('[TrackingSocket] STOMP 에러:', frame.headers['message']);
      callbacks?.onError?.(frame);
    },
    onWebSocketError: (event) => {
      console.warn('[TrackingSocket] WebSocket 에러:', event);
      callbacks?.onError?.(event);
    },
  });

  // 연결 전 액세스 토큰을 헤더에 주입
  client.beforeConnect = async () => {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      client.connectHeaders = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
  };

  return client;
}
