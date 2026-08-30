import { api } from "@/lib/api";
import { ENDPOINTS, TrackingSessionResponse } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACTIVE_SESSION_KEY } from "./use-active-tracking-session";

type CompleteParams = {
  sessionId: number;
  /**
   * 자유기록의 기록 이름. 생략하면 서버가 `260723_등산왕의코스1` 형태로 채운다.
   * 코스 기록은 코스명으로 표시되므로 보내도 무시된다.
   */
  name?: string;
};

export function useCompleteTrackingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sessionId,
      name,
    }: CompleteParams): Promise<TrackingSessionResponse> => {
      const trimmed = name?.trim();
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_COMPLETE(sessionId),
        // 이름이 없으면 body 자체를 생략 — 서버가 기본 이름을 채운다
        ...(trimmed ? { body: { name: trimmed } } : {}),
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY });
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MOUNTAINS_MAP] });
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS],
      });
      if (data.mountainId != null)
        queryClient.invalidateQueries({
          queryKey: [
            ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID(
              data.mountainId,
            ),
          ],
        });
    },
  });
}
