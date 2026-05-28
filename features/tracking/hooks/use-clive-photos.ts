import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useClivePhotos(sessionId: number | null, count = 4) {
  return useQuery({
    queryKey: ["clivePhotos", sessionId, count],
    enabled: sessionId != null,
    queryFn: async () => {
      const res = await api.get<string[]>({
        path: `/api/demo/tracking/sessions/${sessionId}/photos`,
        params: { count },
      });
      return res.data ?? [];
    },
  });
}
