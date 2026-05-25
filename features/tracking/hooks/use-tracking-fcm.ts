import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { PhotoWindowPayload } from './use-tracking-socket';

type Options = {
  /** 트래킹 중일 때만 리스너 등록 */
  enabled: boolean;
  onPhotoWindow: (payload: PhotoWindowPayload) => void;
};

/**
 * 포어그라운드 상태에서 TRACKING_PHOTO_MILESTONE FCM 수신 처리.
 * 백그라운드/잠금화면은 OS가 자동으로 시스템 알림으로 표시하므로 별도 처리 불필요.
 * WebSocket이 연결된 경우 중복 수신될 수 있으나 state 덮어쓰기라 문제없음.
 */
export function useTrackingFcm({ enabled, onPhotoWindow }: Options) {
  useEffect(() => {
    if (!enabled) return;

    const sub = Notifications.addNotificationReceivedListener((notification) => {
      const data = notification.request.content.data as {
        type?: string;
        distance?: string;
      };

      if (data.type !== 'TRACKING_PHOTO_MILESTONE') return;

      const distance = parseFloat(data.distance ?? '0');
      onPhotoWindow({
        milestoneIndex: 0,
        milestoneDistance: distance,
        status: 'OPEN',
        openedAt: new Date().toISOString(),
      });
    });

    return () => sub.remove();
  }, [enabled, onPhotoWindow]);
}
