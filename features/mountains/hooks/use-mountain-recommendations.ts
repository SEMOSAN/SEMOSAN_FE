import { api } from "@/lib/api";
import {
  ENDPOINTS,
  MountainRecommendationResponse,
} from "@/types/api.generated";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

async function getMountainRecommendations(
  lat: number,
  lng: number,
): Promise<MountainRecommendationResponse[]> {
  const res = await api.get<MountainRecommendationResponse[]>({
    path: ENDPOINTS.MOUNTAINS_RECOMMENDATIONS,
    params: { lat, lng },
  });
  return res.data;
}

export function useMountainRecommendations(
  lat: number | undefined,
  lng: number | undefined,
): UseQueryResult<MountainRecommendationResponse[]> {
  return useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_RECOMMENDATIONS, lat, lng],
    queryFn: () => getMountainRecommendations(lat!, lng!),
    enabled:
      typeof lat === "number" &&
      lat !== 0 &&
      typeof lng === "number" &&
      lng !== 0,
  });
}
