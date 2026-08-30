import * as Sentry from "@sentry/react-native";
import { api } from "@/lib/api";
import { NotificationTestRequest } from "@/types/api.generated";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
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
  if (!Device.isDevice) {
    console.log("[Push] 실기기에서만 토큰 등록 가능");
    return;
  }

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

  try {
    // iOS: Firebase SDK로 FCM 등록 토큰 획득 (APNs 토큰 아님)
    // Android: FCM 토큰 직접 반환
    const app = getApp();
    const fcmMessaging = getMessaging(app);
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

function navigateByType(data: PushData, router: ReturnType<typeof useRouter>) {
  let extras: { postId?: number | string; actorId?: number | string } = {};
  try {
    extras = data.extras ? JSON.parse(data.extras) : {};
  } catch {
    extras = {};
  }
  // expo-router typedRoutes 미등록 경로는 as any로 우회
  const push = (path: string) => router.push(path as any);

  switch (data.type) {
    case "COMMUNITY_COMMENT":
    case "COMMUNITY_REPLY":
    case "COMMUNITY_POST_LIKE":
      // 자유게시판 게시글 상세 — postId 없으면 이동하지 않음(undefined 경로 방지)
      if (extras.postId != null) {
        push(`/community/free-board/${extras.postId}`);
      }
      break;

    case "TRACKING_PHOTO_MILESTONE":
    case "TRACKING_SUMMIT_REACHED":
      router.push("/(tabs)/tracking");
      break;

    // SEMOFEED_EMOJI는 개별 글로 이동할 라우트가 없어 이동하지 않는다.
    // 세모피드는 홈 탭 내부 뷰라 `?tab=feed`로 목록까지만 열 수 있고,
    // 반응이 달린 글이 목록 첫 페이지에 없으면 사용자가 찾을 수 없다.
    // (세모피드 단건 조회 및 딥링크 지원 시 여기에 연결)
    default:
      break;
  }
}
