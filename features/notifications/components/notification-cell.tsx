import { ChatIcon } from "@/components/icons/chat-icon";
import { FaceHappyIcon } from "@/components/icons/face-happy-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { MountainIcon } from "@/components/icons/mountain-icon";
import { colors } from "@/constants/colors";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useReadNotification } from "../hooks/use-read-notification";
import { AppNotification, NotificationExtras } from "../types";
import { formatRelativeTime } from "../utils/format-relative-time";
import { navigateByNotificationType } from "../utils/navigate-by-notification";

const ICON_COLOR = colors.label.subtler;

function TypeIcon({ type }: { type: AppNotification["type"] }) {
  switch (type) {
    case "COMMUNITY_COMMENT":
    case "COMMUNITY_REPLY":
      return <ChatIcon size={20} color={ICON_COLOR} />;
    case "COMMUNITY_POST_LIKE":
      return <HeartIcon size={20} color={ICON_COLOR} />;
    case "SEMOFEED_EMOJI":
      return <FaceHappyIcon size={20} color={ICON_COLOR} />;
    default:
      return <MountainIcon size={20} color={ICON_COLOR} />;
  }
}

function toExtras(notification: AppNotification): NotificationExtras {
  if (notification.targetId == null) return {};
  switch (notification.targetType) {
    case "COMMUNITY_POST":
      return { postId: notification.targetId };
    case "SEMOFEED":
      return { semoFeedId: notification.targetId };
    default:
      return {};
  }
}

export function NotificationCell({
  notification,
}: {
  notification: AppNotification;
}) {
  const router = useRouter();
  const { mutate: markAsRead } = useReadNotification();

  function handlePress() {
    if (!notification.isRead && notification.notificationId != null) {
      markAsRead(notification.notificationId);
    }
    if (notification.type) {
      navigateByNotificationType(
        notification.type,
        toExtras(notification),
        router,
      );
    }
  }

  return (
    <TouchableOpacity
      className="flex-row gap-3 bg-fill-normal px-5 py-4"
      activeOpacity={0.7}
      onPress={handlePress}
    >
      <View className="h-10 w-10 items-center justify-center rounded-full bg-fill-strong">
        <TypeIcon type={notification.type} />
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            className={`shrink ${
              notification.isRead
                ? "typo-body-2-normal-medium text-label-subtle"
                : "typo-body-2-normal-semi-bold text-label-normal"
            }`}
            numberOfLines={1}
          >
            {notification.title ?? "알림"}
          </Text>
          {!notification.isRead && (
            <View className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary-normal" />
          )}
        </View>
        {!!notification.body && (
          <Text
            className="typo-body-3-regular text-label-subtler"
            numberOfLines={2}
          >
            {notification.body}
          </Text>
        )}
        {!!notification.createdAt && (
          <Text className="typo-caption-1-regular text-label-subtler">
            {formatRelativeTime(notification.createdAt)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
