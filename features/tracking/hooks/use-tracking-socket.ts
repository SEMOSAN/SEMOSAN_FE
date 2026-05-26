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

  const connect = useCallback((sessionId?: number) => {
    if (clientRef.current?.active) {
      console.log('[TrackingSocket] connect 스킵 — 이미 active. sessionId:', sessionId);
      return;
    }

    console.log('[TrackingSocket] connect 호출. sessionId:', sessionId);
    setStatus('connecting');

    createTrackingStompClient({
      onConnect: () => {
        setStatus('connected');
        console.log('[TrackingSocket] onConnect 진입. sessionId:', sessionId, 'clientRef.current:', !!clientRef.current);
        // 연결 완료 후 sessionId가 있으면 photo-window 구독
        if (sessionId != null) {
          // clientRef.current가 아직 세팅 안 됐을 경우를 대비해 짧게 대기
          const trySubscribe = (attempt = 0) => {
            const client = clientRef.current;
            if (!client) {
              if (attempt < 5) {
                console.warn(`[TrackingSocket] clientRef null, 재시도 ${attempt + 1}/5`);
                setTimeout(() => trySubscribe(attempt + 1), 50);
              } else {
                console.error('[TrackingSocket] clientRef null — 구독 실패');
              }
              return;
            }
            subscriptionRef.current?.unsubscribe();
            console.log(`[TrackingSocket] 구독 시작: /topic/tracking/${sessionId}/photo-window`);
            subscriptionRef.current = client.subscribe(
              `/topic/tracking/${sessionId}/photo-window`,
              (message) => {
                console.log('[TrackingSocket] photo-window 메시지 수신:', message.body);
                try {
                  const payload: PhotoWindowPayload = JSON.parse(message.body);
                  onPhotoWindow?.(payload);
                } catch {
                  console.warn('[TrackingSocket] photo-window 파싱 실패:', message.body);
                }
              },
            );
          };
          trySubscribe();
        }
      },
      onDisconnect: () => {
        console.log('[TrackingSocket] 연결 해제됨');
        setStatus('disconnected');
      },
      onError: (e) => {
        console.warn('[TrackingSocket] 연결 오류:', e);
        setStatus('error');
      },
    }).then((client) => {
      clientRef.current = client;
      client.activate();
    });
  }, [onPhotoWindow]);

  const subscribePhotoWindow = useCallback((sessionId: number) => {
    const client = clientRef.current;
    if (!client?.connected) return;

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

  const disconnect = useCallback(() => {
    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
    }
    clientRef.current = null;
    setStatus('disconnected');
  }, []);

  const publishGps = useCallback((
    sessionId: number,
    coords: { lat: number; lng: number; altitude: number | null; recordedAt: string },
  ) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn('[TrackingSocket] publishGps 스킵 — connected:', client?.connected, 'active:', client?.active);
      return;
    }

    client.publish({
      destination: `/app/tracking/${sessionId}/gps`,
      body: JSON.stringify({
        lat: coords.lat,
        lng: coords.lng,
        altitude: coords.altitude ?? 0,
        recordedAt: coords.recordedAt.replace('Z', ''),
      }),
    });
  }, []);

  // 컴포넌트 언마운트 시 자동 해제
  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return { connect, disconnect, subscribePhotoWindow, publishGps, status };
}
