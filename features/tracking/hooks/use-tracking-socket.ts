import { createTrackingStompClient } from '@/lib/tracking-socket';
import { Client } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';

export type SocketStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export function useTrackingSocket() {
  const clientRef = useRef<Client | null>(null);
  const [status, setStatus] = useState<SocketStatus>('disconnected');

  const connect = useCallback(() => {
    if (clientRef.current?.active) return;

    setStatus('connecting');

    const client = createTrackingStompClient({
      onConnect: () => setStatus('connected'),
      onDisconnect: () => setStatus('disconnected'),
      onError: () => setStatus('error'),
    });

    client.activate();
    clientRef.current = client;
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current?.active) {
      clientRef.current.deactivate();
    }
    clientRef.current = null;
    setStatus('disconnected');
  }, []);

  // 컴포넌트 언마운트 시 연결 해제
  useEffect(() => {
    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  return { connect, disconnect, status, client: clientRef };
}
