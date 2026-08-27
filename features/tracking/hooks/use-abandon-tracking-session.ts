import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACTIVE_SESSION_KEY } from "./use-active-tracking-session";

/** 세션을 기록으로 남기지 않고 폐기 — complete와 달리 hikingRecord를 만들지 않음 */
export function useAbandonTrackingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number): Promise<void> => {
      await api.post(
        { path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_ABANDON(sessionId) },
        { ignoreErrorToast: true },
      );
    },
    onSettled: () => {
      // 성공/실패와 무관하게 활성 세션 갱신
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY });
    },
  });
}
