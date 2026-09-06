import * as Sentry from "@sentry/react-native";
import { api } from "@/lib/api";
import type { NotificationExtras } from "@/features/notifications/types";
import { navigateByNotificationType } from "@/features/notifications/utils/navigate-by-notification";
import { NotificationTestRequest } from "@/types/api.generated";
import { getApp } from "@react-native-firebase/app";
import {
  getAPNSToken,
  getMessaging,
  getToken,
  onMessage,
  setAPNSToken,
} from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

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
    registerFcmToken();

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

// ─── FCM 토큰 등록 ───────────────────────────────────────────

async function registerFcmToken() {
  // 권한 요청은 시뮬레이터에서도 수행한다.
  // simctl push로 알림 표시·탭 라우팅을 검증하려면 권한이 필요하다.
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("[Push] 알림 권한 거부됨");
    return;
  }

  // FCM 토큰은 실기기에서만 발급된다
  if (!Device.isDevice) {
    console.log("[Push] 실기기에서만 토큰 등록 가능");
    return;
  }

  try {
    // iOS: Firebase SDK로 FCM 등록 토큰 획득 (APNs 토큰 아님)
    // Android: FCM 토큰 직접 반환
    const app = getApp();
    const fcmMessaging = getMessaging(app);

    // APNs 토큰이 붙지 않으면 FCM 토큰이 발급돼도 iOS로 전달되지 않는다.
    // 원인 추적이 어려웠던 지점이라 값을 남긴다.
    if (Platform.OS === "ios") {
      const apnsToken = await getAPNSToken(fcmMessaging);
      console.log(
        "[Push] APNs 토큰:",
        apnsToken ? `있음 (${apnsToken.length}자)` : "null — APNs 등록 실패",
      );

      // 개발 빌드는 APNs 샌드박스를 쓰는데, Firebase SDK의 프로비저닝 프로파일
      // 기반 자동 판별이 실패하면 FCM이 프로덕션 서버로 보내고 APNs가 조용히
      // 거절한다(앱에 아무 흔적도 남지 않음). 개발 빌드에서만 환경을 명시한다.
      if (__DEV__ && apnsToken) {
        await setAPNSToken(fcmMessaging, apnsToken, "sandbox");
        console.log("[Push] APNs 토큰 타입을 sandbox로 명시");
      }
    }

    const token = await getToken(fcmMessaging);

    await api.post({
      path: "/api/fcm/tokens",
      body: {
        token,
        deviceType: Platform.OS === "ios" ? "IOS" : "ANDROID",
      },
    });

    console.log("[Push] FCM 토큰 등록 완료:", token);
  } catch (error) {
    console.error("[Push] FCM 토큰 등록 실패:", error);
    Sentry.captureException(new Error("FcmTokenRegistrationFailed"));
  }
}

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
    extras = data.extras ? JSON.parse(data.extras) : {};
  } catch {
    extras = {};
  }
  navigateByNotificationType(data.type, extras, router);
}
