import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";

export function useClivePhotos(sessionId: number | null) {
  return useQuery({
    queryKey: ["clivePhotos", sessionId],
    enabled: sessionId != null,
    queryFn: async () => {
      const res = await api.get<string[]>({
        path: `${ENDPOINTS.DEMO_TRACKING_SESSIONS_BY_SESSIONID_PHOTOS(sessionId!)}?count=2`,
      });
      return res.data ?? [];
    },
  });
}
