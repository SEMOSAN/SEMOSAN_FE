import { api } from "@/lib/api";
import { ENDPOINTS, TrackingSessionResponse } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ACTIVE_SESSION_KEY } from "./use-active-tracking-session";

export function useCompleteTrackingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_COMPLETE(sessionId),
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
