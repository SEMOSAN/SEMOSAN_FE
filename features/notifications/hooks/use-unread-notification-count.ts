import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

/**
 * 안읽음 알림 수. 헤더 벨과 앱 아이콘 뱃지가 모두 이 값을 따른다.
 * 푸시 페이로드의 badge에만 의존하면 서버가 보내는 고정값에 묶여 개수가 늘지 않는다.
 */
export function useUnreadNotificationCount() {
  const query = useQuery<number>({
    queryKey: ["notifications", "unread-count"],
    // 뱃지는 최신 값이 중요하므로 화면 복귀 때마다 다시 확인한다
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<number>(
        { path: ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT },
        // 뱃지는 부가 정보라 실패해도 사용자에게 알리지 않는다
        { ignoreErrorToast: true },
      );
      return res.data ?? 0;
    },
  });

  const count = query.data;
  useEffect(() => {
    if (count == null) return;
    Notifications.setBadgeCountAsync(count).catch(() => {});
  }, [count]);

  return query;
}
