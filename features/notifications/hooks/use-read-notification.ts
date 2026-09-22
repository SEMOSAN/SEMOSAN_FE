import { api } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

function invalidateNotifications() {
  queryClient.invalidateQueries({ queryKey: ["notifications"] });
}

/** 알림 단건 읽음 처리 (셀 탭 시) */
export function useReadNotification() {
  return useMutation({
    mutationFn: (notificationId: number) =>
      api.patch(
        { path: ENDPOINTS.NOTIFICATIONS_BY_NOTIFICATIONID_READ(notificationId) },
        { ignoreErrorToast: true },
      ),
    onSuccess: invalidateNotifications,
  });
}

/** 알림 전체 읽음 처리 */
export function useReadAllNotifications() {
  return useMutation({
    mutationFn: () =>
      api.patch({ path: ENDPOINTS.NOTIFICATIONS_READ_ALL }),
    onSuccess: invalidateNotifications,
  });
}
