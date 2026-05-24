import { api } from '@/lib/api';
import { ENDPOINTS, TrackingSessionResponse } from '@/types/api.generated';
import { useQuery } from '@tanstack/react-query';

export const ACTIVE_SESSION_KEY = [ENDPOINTS.TRACKING_SESSIONS_ME_ACTIVE] as const;

export function useActiveTrackingSession() {
  return useQuery({
    queryKey: ACTIVE_SESSION_KEY,
    queryFn: async (): Promise<TrackingSessionResponse | null> => {
      const res = await api.get<TrackingSessionResponse>({
        path: ENDPOINTS.TRACKING_SESSIONS_ME_ACTIVE,
      });
      // data가 비어있으면 null 반환
      return res.data ?? null;
    },
    staleTime: 0,
  });
}
