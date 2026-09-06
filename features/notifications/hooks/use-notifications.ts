import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";
import { AppNotification } from "../types";

// api-docs에는 응답이 단건으로 선언돼 있지만 page/size를 받는 목록 API라
// 배열과 PageResponse 래핑 두 형태를 모두 받아들인다
type NotificationListData = AppNotification[] | { content?: AppNotification[] };

function normalize(data: NotificationListData | undefined): AppNotification[] {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.content ?? []);
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
