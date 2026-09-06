import { NotificationResponse } from "@/types/api.generated";

export type AppNotification = NotificationResponse;

export type NotificationType = NonNullable<NotificationResponse["type"]>;

/** 알림 타입별 이동 대상. 푸시 페이로드의 extras와 같은 형태다. */
export type NotificationExtras = {
  postId?: number | string;
  actorId?: number | string;
  semoFeedId?: number | string;
};
