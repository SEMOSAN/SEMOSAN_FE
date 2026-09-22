import type { useRouter } from "expo-router";
import { NotificationExtras, NotificationType } from "../types";

/** 알림 타입별 화면 이동. 푸시 알림 탭과 알림함 셀 탭이 공유한다. */
export function navigateByNotificationType(
  type: NotificationType,
  extras: NotificationExtras,
  router: ReturnType<typeof useRouter>,
): void {
  // expo-router typedRoutes 미등록 경로는 as any로 우회
  const push = (path: string) => router.push(path as any);

  switch (type) {
    case "COMMUNITY_COMMENT":
    case "COMMUNITY_REPLY":
    case "COMMUNITY_POST_LIKE":
      if (extras.postId != null) {
        push(`/community/free-board/${extras.postId}`);
      }
      break;

    case "TRACKING_PHOTO_MILESTONE":
    case "TRACKING_SUMMIT_REACHED":
      router.push("/(tabs)/tracking");
      break;

    case "SEMOFEED_EMOJI":
      if (extras.semoFeedId != null) {
        push(`/semofeed/${extras.semoFeedId}`);
      }
      break;

    default:
      break;
  }
}
