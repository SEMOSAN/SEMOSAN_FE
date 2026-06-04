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

type FcmExtras = {
  distance?: string | number;
  milestoneIndex?: string | number;
  [key: string]: unknown;
};

type FcmData = {
  type?: string;
  distance?: string;
  milestoneIndex?: string;
  extras?: string;
} | null;

/**
 * TRACKING_PHOTO_MILESTONE FCM 수신 처리.
 * - 포어그라운드: Firebase onMessage → 인앱 배너 + 로컬 알림
 * - 백그라운드/잠금화면에서 알림 탭: addNotificationResponseReceivedListener → 인앱 배너
 * Firebase SDK 충돌로 content.data가 null인 경우 trigger.payload에서 직접 읽음.
 */
export function useTrackingFcm({ enabled, onPhotoWindow }: Options) {
  useEffect(() => {
    if (!enabled) return;

    const parseExtras = (data: FcmData): FcmExtras => {
      if (!data?.extras) return {};
      try {
        return JSON.parse(data.extras) as FcmExtras;
      } catch {
        return {};
      }
    };

    const parseDistance = (data: FcmData): number => {
      if (!data) return 0;
      const extras = parseExtras(data);
      if (extras.distance != null) return Number(extras.distance);
      return parseFloat(data.distance ?? '0');
    };

    const parseMilestoneIndex = (data: FcmData): number => {
      if (!data) return 0;
      const extras = parseExtras(data);
      if (extras.milestoneIndex != null) return Number(extras.milestoneIndex);
      if (data.milestoneIndex != null) return Number(data.milestoneIndex);
      return 0;
    };

    const buildPayload = (data: FcmData): PhotoWindowPayload => ({
      milestoneIndex: parseMilestoneIndex(data),
      milestoneDistance: parseDistance(data),
      status: 'OPEN',
      openedAt: new Date().toISOString(),
    });

    const extractPayload = (notification: Notifications.Notification) => {
      // content.data 우선, Firebase SDK 충돌로 null이면 trigger.payload에서 읽음
      const contentData = notification.request.content.data as FcmData;
      const triggerPayload = (notification.request.trigger as any)?.payload as FcmData;
      const data = contentData?.type ? contentData : triggerPayload;

      if (!data || data.type !== 'TRACKING_PHOTO_MILESTONE') return;

      onPhotoWindow(buildPayload(data));
    };

    // 포어그라운드 FCM 수신 — Firebase SDK가 expo-notifications보다 우선하므로 onMessage 사용
    const fcmMessaging = getMessaging(getApp());
    const unsubscribeFcm = onMessage(fcmMessaging, async (remoteMessage) => {
      console.log('[TrackingFCM] 포어그라운드 FCM 수신:', JSON.stringify(remoteMessage.data));
      const data = remoteMessage.data as FcmData;
      if (!data || data.type !== 'TRACKING_PHOTO_MILESTONE') return;

      const payload = buildPayload(data);
      console.log('[TrackingFCM] milestoneIndex:', payload.milestoneIndex, 'distance:', payload.milestoneDistance);

      // 인앱 PhotoWindowBanner 활성화
      // notification 필드가 포함된 FCM 페이로드로 변경되어 iOS가 자동으로 시스템 배너 표시
      onPhotoWindow(payload);
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
