import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { PhotoWindowPayload } from './use-tracking-socket';

type Options = {
  /** 트래킹 중일 때만 리스너 등록 */
  enabled: boolean;
  onPhotoWindow: (payload: PhotoWindowPayload) => void;
};

type FcmData = { type?: string; distance?: string; extras?: string } | null;

/**
 * TRACKING_PHOTO_MILESTONE FCM 수신 처리.
 * - 포어그라운드: addNotificationReceivedListener → 인앱 배너
 * - 백그라운드/잠금화면에서 알림 탭: addNotificationResponseReceivedListener → 인앱 배너
 * Firebase SDK 충돌로 content.data가 null인 경우 trigger.payload에서 직접 읽음.
 */
export function useTrackingFcm({ enabled, onPhotoWindow }: Options) {
  useEffect(() => {
    if (!enabled) return;

    const parseDistance = (data: FcmData): number => {
      if (!data) return 0;
      if (data.extras) {
        try {
          const extras = JSON.parse(data.extras);
          if (extras.distance != null) return Number(extras.distance);
        } catch {}
      }
      return parseFloat(data.distance ?? '0');
    };

    const extractPayload = (notification: Notifications.Notification) => {
      // content.data 우선, Firebase SDK 충돌로 null이면 trigger.payload에서 읽음
      const contentData = notification.request.content.data as FcmData;
      const triggerPayload = (notification.request.trigger as any)?.payload as FcmData;
      const data = contentData?.type ? contentData : triggerPayload;

      if (!data || data.type !== 'TRACKING_PHOTO_MILESTONE') return;

      onPhotoWindow({
        milestoneIndex: 0,
        milestoneDistance: parseDistance(data),
        status: 'OPEN',
        openedAt: new Date().toISOString(),
      });
    };

    // 포어그라운드 FCM 수신 — Firebase SDK가 expo-notifications보다 우선하므로 onMessage 사용
    const fcmMessaging = getMessaging(getApp());
    const unsubscribeFcm = onMessage(fcmMessaging, async (remoteMessage) => {
      console.log('[TrackingFCM] 포어그라운드 FCM 수신:', JSON.stringify(remoteMessage.data));
      const data = remoteMessage.data as FcmData;
      if (!data || data.type !== 'TRACKING_PHOTO_MILESTONE') return;

      const distance = parseDistance(data);

      // 인앱 PhotoWindowBanner 활성화
      onPhotoWindow({
        milestoneIndex: 0,
        milestoneDistance: distance,
        status: 'OPEN',
        openedAt: new Date().toISOString(),
      });

      // 포어그라운드 시스템 배너 수동 표시 (Firebase SDK가 자동 표시 안 함)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'SEMOSAN',
          body: `${distance}m 돌파! 인증 사진을 남겨보세요!`,
        },
        trigger: null,
      });
    });

    // 백그라운드/잠금화면 알림 탭 후 앱 복귀
    const tapSub = Notifications.addNotificationResponseReceivedListener((response) => {
      extractPayload(response.notification);
    });

    return () => {
      unsubscribeFcm();
      tapSub.remove();
    };
  }, [enabled, onPhotoWindow]);
}
