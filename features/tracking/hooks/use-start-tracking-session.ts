import { api } from '@/lib/api';
import {
  ENDPOINTS,
  StartTrackingSessionRequest,
  TrackingSessionResponse,
} from '@/types/api.generated';
import { useMutation } from '@tanstack/react-query';

export function useStartTrackingSession() {
  return useMutation({
    mutationFn: async (body: StartTrackingSessionRequest): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS,
        body,
      });
      return res.data;
    },
  });
}
