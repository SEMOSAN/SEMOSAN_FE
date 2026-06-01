import { api } from '@/lib/api';
import { ENDPOINTS, TrackingSessionResponse } from '@/types/api.generated';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACTIVE_SESSION_KEY } from './use-active-tracking-session';

export function useResumeTrackingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: number): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_RESUME(sessionId),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY });
    },
  });
}
