import { NotificationResponse } from "@/types/api.generated";

/** 서버 알림함 응답 타입 (types/api.generated.ts) */
export type AppNotification = NotificationResponse;

// 백엔드 NotificationType enum과 동기화
export type NotificationType = NonNullable<NotificationResponse["type"]>;

/** 알림 타입별 부가 데이터 (푸시 extras와 동일한 형태) */
export type NotificationExtras = {
  postId?: number | string;
  actorId?: number | string;
  semoFeedId?: number | string;
};
