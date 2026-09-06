import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

/** 홈 헤더 벨 아이콘의 안읽음 뱃지용 카운트 */
export function useUnreadNotificationCount() {
  return useQuery<number>({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await api.get<number>(
        { path: ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT },
        // 뱃지는 부가 정보라 실패해도 사용자에게 알리지 않는다
        { ignoreErrorToast: true },
      );
      return res.data ?? 0;
    },
  });
}
