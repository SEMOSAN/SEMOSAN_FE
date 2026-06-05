import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";

type ClivePhoto = {
  photoId: number;
  trackingSessionId: number;
  milestoneIndex: number;
  milestoneDistanceM: number;
  imageUrl: string;
  capturedAt: string;
  lat: number;
  lng: number;
  altitude: number;
};

export function useClivePhotos(sessionId: number | null) {
  return useQuery({
    queryKey: ["clivePhotos", sessionId],
    enabled: sessionId != null,
    queryFn: async () => {
      const res = await api.get<ClivePhoto[]>({
        path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_PHOTOS(sessionId!),
      });
      return (res.data ?? []).map((p) => p.imageUrl);
    },
  });
}
