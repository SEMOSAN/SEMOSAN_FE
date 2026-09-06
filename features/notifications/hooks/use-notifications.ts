import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";
import { AppNotification } from "../types";

/**
 * api-docs에는 응답이 NotificationResponse 단건으로 선언돼 있지만
 * 페이지네이션 파라미터를 받는 목록 API라 실제로는 배열 또는
 * PageResponse 래핑일 수 있다. 두 형태 모두 수용한다.
 */
type NotificationListData =
  | AppNotification[]
  | { content?: AppNotification[] };

function normalize(data: NotificationListData | undefined): AppNotification[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.content ?? [];
}

export function useNotifications() {
  return useQuery<AppNotification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await api.get<NotificationListData>({
        path: ENDPOINTS.NOTIFICATIONS,
        params: { page: 0, size: 50 },
      });
      return normalize(res.data);
    },
  });
}
