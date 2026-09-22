import { registerFcmToken } from "@/features/notifications/register-fcm-token";
import type { NotificationExtras } from "@/features/notifications/types";
import { navigateByNotificationType } from "@/features/notifications/utils/navigate-by-notification";
import { NotificationTestRequest } from "@/types/api.generated";
import { getApp } from "@react-native-firebase/app";
import { getMessaging, onMessage } from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

// 트래킹 전용 타입 — use-tracking-fcm.ts에서 처리하므로 여기서 제외
const TRACKING_TYPES = new Set([
  "TRACKING_PHOTO_MILESTONE",
  "TRACKING_SUMMIT_REACHED",
]);

/**
 * 앱 시작 시 FCM 토큰을 서버에 등록하고
 * 포어그라운드 알림 수신 및 알림 탭 이벤트를 처리하는 훅
 *
 * 역할 분리:
 * - 이 훅: 트래킹 외 모든 FCM 포어그라운드 수신 → 시스템 배너 표시
 * - use-tracking-fcm.ts: TRACKING_PHOTO_MILESTONE → 인앱 PhotoWindowBanner
 */
export function usePushNotification(enabled = true): void {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    // 앱 시작 시 등록. 로그인 직후 등록은 startSession 이 담당한다
    void registerFcmToken();

    // 포어그라운드 FCM 수신 — Firebase SDK가 expo-notifications보다 우선하므로 onMessage 사용
    // 트래킹 타입은 use-tracking-fcm.ts에서 처리하므로 제외
    const fcmMessaging = getMessaging(getApp());
    const unsubscribeFcm = onMessage(fcmMessaging, async (remoteMessage) => {
      const type =
        typeof remoteMessage.data?.type === "string"
          ? remoteMessage.data.type
          : undefined;
      // 수신 여부를 확인할 수단이 없어 진단이 어려웠던 지점 (트래킹 훅과 동일하게 로깅)
      console.log(
        "[Push] 포어그라운드 수신:",
        type,
        "notification:",
        remoteMessage.notification != null,
        "data keys:",
        Object.keys(remoteMessage.data ?? {}).join(","),
      );
      if (type && TRACKING_TYPES.has(type)) return;

      const title =
        remoteMessage.notification?.title ??
        (typeof remoteMessage.data?.title === "string"
          ? remoteMessage.data.title
          : undefined);
      const body =
        remoteMessage.notification?.body ??
        (typeof remoteMessage.data?.body === "string"
          ? remoteMessage.data.body
          : undefined);
      if (!title && !body) return;

      await Notifications.scheduleNotificationAsync({
        content: { title: title ?? "SEMOSAN", body: body ?? "" },
        trigger: null,
      });
    });

    // 알림 탭 → 화면 이동
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = extractPushData(response);
        console.log("[Push] 알림 탭:", data?.type, "extras:", data?.extras);
        if (data) navigateByType(data, router);
      },
    );

    // 앱이 종료된 상태에서 알림 탭으로 열린 경우
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = extractPushData(response);
      if (data) navigateByType(data, router);
    });

    return () => {
      unsubscribeFcm();
      tapSub.remove();
    };
  }, [router, enabled]);
}

// ─── 타입 ───────────────────────────────────────────────────

type PushData = {
  type: NotificationType;
  notificationId?: string;
  extras?: string; // JSON 문자열
};

// 백엔드 NotificationType enum과 동기화
// (types/api.generated.ts의 NotificationTestRequest.type과 같은 목록)
type NotificationType = NotificationTestRequest["type"];

// ─── 알림 탭 라우팅 ──────────────────────────────────────────

/**
 * 알림 응답에서 데이터 추출.
 * 백그라운드/종료 상태 탭 시 Firebase SDK 충돌로 content.data가 비어 있고
 * 실제 데이터가 trigger.payload에 담기므로 폴백 처리한다. (use-tracking-fcm.ts와 동일)
 */
function extractPushData(
  response: Notifications.NotificationResponse,
): PushData | null {
  const contentData = response.notification.request.content.data as
    | PushData
    | undefined;
  if (contentData?.type) return contentData;
  const triggerPayload = (response.notification.request.trigger as any)
    ?.payload as PushData | undefined;
  if (triggerPayload?.type) return triggerPayload;
  return null;
}

// 타입별 라우팅 분기는 알림함 셀 탭과 공유한다
function navigateByType(data: PushData, router: ReturnType<typeof useRouter>) {
  let extras: NotificationExtras = {};
  try {
    // JSON.parse("null")은 null을 돌려주므로 객체인지 확인하고 쓴다
    const parsed: unknown = data.extras ? JSON.parse(data.extras) : null;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      extras = parsed as NotificationExtras;
    }
  } catch {
    extras = {};
  }
  navigateByNotificationType(data.type, extras, router);
}
