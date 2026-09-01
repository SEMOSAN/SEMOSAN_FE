import { getApp } from '@react-native-firebase/app';
import { getMessaging, onMessage } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { PhotoWindowPayload } from './use-tracking-socket';

type Options = {
  /** 트래킹 중일 때만 리스너 등록 */
  enabled: boolean;
  onPhotoWindow: (payload: PhotoWindowPayload) => void;
  /** 정상 도달 — 정상 인증 시트 표시 및 인증 사진 창 확보 */
  onSummitReached?: (payload: PhotoWindowPayload) => void;
};

type FcmExtras = {
  distance?: string | number;
  milestoneIndex?: string | number;
  milestoneDistanceM?: string | number;
  [key: string]: unknown;
};

// FCM data는 모든 값이 문자열로 온다 (백엔드가 String.valueOf로 넣음)
type FcmData = {
  type?: string;
  /** TRACKING_PHOTO_MILESTONE의 마일스톤 거리 */
  distance?: string;
  /** TRACKING_SUMMIT_REACHED의 마일스톤 거리 */
  milestoneDistanceM?: string;
  milestoneIndex?: string;
  extras?: string;
} | null;

const PHOTO_MILESTONE = "TRACKING_PHOTO_MILESTONE";
const SUMMIT_REACHED = "TRACKING_SUMMIT_REACHED";

/**
 * TRACKING_PHOTO_MILESTONE FCM 수신 처리.
 * - 포어그라운드: Firebase onMessage → 인앱 배너 + 로컬 알림
 * - 백그라운드/잠금화면에서 알림 탭: addNotificationResponseReceivedListener → 인앱 배너
 * Firebase SDK 충돌로 content.data가 null인 경우 trigger.payload에서 직접 읽음.
 */
export function useTrackingFcm({
  enabled,
  onPhotoWindow,
  onSummitReached,
}: Options) {
  useEffect(() => {
    if (!enabled) return;

    // JSON.parse는 "null"·"[]"·"3" 같은 입력도 성공하므로 평범한 객체만 통과시킨다.
    // null이 그대로 반환되면 호출부에서 extras.distance를 읽다가 예외가 난다.
    const parseExtras = (data: FcmData): FcmExtras => {
      if (!data?.extras) return {};
      try {
        const parsed: unknown = JSON.parse(data.extras);
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          Array.isArray(parsed)
        )
          return {};
        return parsed as FcmExtras;
      } catch {
        return {};
      }
    };

    // 마일스톤 거리 키가 타입별로 다르다.
    // PHOTO_MILESTONE은 distance, SUMMIT_REACHED는 milestoneDistanceM.
    const parseDistance = (data: FcmData): number => {
      if (!data) return 0;
      const extras = parseExtras(data);
      if (extras.milestoneDistanceM != null)
        return Number(extras.milestoneDistanceM);
      if (extras.distance != null) return Number(extras.distance);
      if (data.milestoneDistanceM != null)
        return parseFloat(data.milestoneDistanceM);
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

      if (!data) return;
      if (data.type === SUMMIT_REACHED) {
        onSummitReached?.(buildPayload(data));
        return;
      }
      if (data.type !== PHOTO_MILESTONE) return;

      onPhotoWindow(buildPayload(data));
    };

    // 포어그라운드 FCM 수신 — Firebase SDK가 expo-notifications보다 우선하므로 onMessage 사용
    const fcmMessaging = getMessaging(getApp());
    const unsubscribeFcm = onMessage(fcmMessaging, async (remoteMessage) => {
      console.log('[TrackingFCM] 포어그라운드 FCM 수신:', JSON.stringify(remoteMessage.data));
      const data = remoteMessage.data as FcmData;
      if (!data) return;

      if (data.type === SUMMIT_REACHED) {
        const summitPayload = buildPayload(data);
        console.log(
          "[TrackingFCM] 정상 도달 — milestoneIndex:",
          summitPayload.milestoneIndex,
          "distance:",
          summitPayload.milestoneDistance,
        );
        onSummitReached?.(summitPayload);
        return;
      }

      if (data.type !== PHOTO_MILESTONE) return;

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
  }, [enabled, onPhotoWindow, onSummitReached]);
}
