import { api } from '@/lib/api';
import {
  ENDPOINTS,
  CreateTrackingSessionRequest,
  TrackingSessionResponse,
} from '@/types/api.generated';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ACTIVE_SESSION_KEY } from './use-active-tracking-session';

export function useStartTrackingSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: CreateTrackingSessionRequest): Promise<TrackingSessionResponse> => {
      const res = await api.post<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS,
        body,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSION_KEY });
    },
  });
}
