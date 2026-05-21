import { api } from '@/lib/api';
import { ENDPOINTS, TrackingSessionResponse } from '@/types/api.generated';
import { useMutation } from '@tanstack/react-query';

export function useResumeTrackingSession() {
  return useMutation({
    mutationFn: async (sessionId: number): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_RESUME(sessionId),
      });
      return res.data;
    },
  });
}
