import { api } from '@/lib/api';
import { ENDPOINTS, TrackingSessionResponse } from '@/types/api.generated';
import { useMutation } from '@tanstack/react-query';

export function usePauseTrackingSession() {
  return useMutation({
    mutationFn: async (sessionId: number): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_PAUSE(sessionId),
      });
      return res.data;
    },
  });
}
