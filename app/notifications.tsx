import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { NotificationCell } from "@/features/notifications/components/notification-cell";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useReadAllNotifications } from "@/features/notifications/hooks/use-read-notification";
import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Text className="typo-body-1-normal-medium text-label-subtle">
        새로운 알림이 없어요
      </Text>
      <Text className="typo-body-2-normal-regular text-label-subtler">
        댓글, 좋아요, 등산 소식이 여기에 모여요
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: notifications = [], isLoading } = useNotifications();
  const { mutate: readAll } = useReadAllNotifications();
  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <View className="flex-1 bg-fill-normal">
      <View
        className="h-14 flex-row items-center gap-2 bg-fill-normal px-5"
        style={{ marginTop: insets.top }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
          <ChevronLeftIcon size={24} color="#1a1b1f" />
        </TouchableOpacity>
        <Text className="flex-1 typo-headline-1-semi-bold text-label-normal">
          알림
        </Text>
        {hasUnread && (
          <TouchableOpacity onPress={() => readAll()} activeOpacity={0.6}>
            <Text className="typo-body-3-medium text-label-subtle">
              모두 읽음
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {!isLoading && notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => String(item.notificationId)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          renderItem={({ item }) => <NotificationCell notification={item} />}
        />
      )}
    </View>
  );
}
