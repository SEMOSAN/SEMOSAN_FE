import { createTrackingStompClient } from '@/lib/tracking-socket';
import { Client, StompSubscription } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type PhotoWindowPayload = {
  milestoneIndex: number;
  milestoneDistance: number;
  status: 'OPEN' | 'CLOSED';
  openedAt?: string;
  closedAt?: string;
};

type UseTrackingSocketOptions = {
  onPhotoWindow?: (payload: PhotoWindowPayload) => void;
};

export function useTrackingSocket({ onPhotoWindow }: UseTrackingSocketOptions = {}) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const [status, setStatus] = useState<SocketStatus>('disconnected');

  const subscribePhotoWindow = useCallback((sessionId: number) => {
    const client = clientRef.current;
    if (!client?.connected) return;

    // 기존 구독 해제 후 재구독
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = client.subscribe(
      `/topic/tracking/${sessionId}/photo-window`,
      (message) => {
        try {
          const payload: PhotoWindowPayload = JSON.parse(message.body);
          onPhotoWindow?.(payload);
        } catch {
          console.warn('[TrackingSocket] photo-window 파싱 실패:', message.body);
        }
      },
    );
  }, [onPhotoWindow]);

  const connect = useCallback((sessionId?: number) => {
    if (clientRef.current?.active) return;

    setStatus('connecting');

    const client = createTrackingStompClient({
      onConnect: () => {
        setStatus('connected');
        // 연결 완료 후 sessionId가 있으면 바로 구독
        if (sessionId != null) {
          subscriptionRef.current?.unsubscribe();
          subscriptionRef.current = client.subscribe(
            `/topic/tracking/${sessionId}/photo-window`,
            (message) => {
              try {
                const payload: PhotoWindowPayload = JSON.parse(message.body);
                onPhotoWindow?.(payload);
              } catch {
                console.warn('[TrackingSocket] photo-window 파싱 실패:', message.body);
              }
            },
          );
        }
      },
      onDisconnect: () => setStatus('disconnected'),
      onError: () => setStatus('error'),
    });

    client.activate();
    clientRef.current = client;
  }, [onPhotoWindow]);

  const disconnect = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    clientRef.current?.deactivate();
    clientRef.current = null;
    setStatus('disconnected');
  }, []);

  // 컴포넌트 언마운트 시 자동 해제
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      clientRef.current?.deactivate();
    };
  }, []);

  const publishGps = useCallback((
    sessionId: number,
    coords: { lat: number; lng: number; altitude: number | null; recordedAt: string },
  ) => {
    const client = clientRef.current;
    if (!client?.connected) return;

    client.publish({
      destination: `/app/tracking/${sessionId}/gps`,
      body: JSON.stringify({
        lat: coords.lat,
        lng: coords.lng,
        altitude: coords.altitude ?? 0,
        recordedAt: coords.recordedAt,
      }),
    });
  }, []);

  return { connect, disconnect, subscribePhotoWindow, publishGps, status };
}
