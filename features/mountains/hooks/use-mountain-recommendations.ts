import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export type MountainRecommendationItem = {
  mountainId: number;
  name: string;
  imageUrl?: string;
  difficulty: "EASY" | "NORMAL" | "HARD";
  altitude: number;
  address: string;
};

type RecommendationsData = {
  content: MountainRecommendationItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

async function getMountainRecommendations(
  lat: number,
  lng: number,
): Promise<RecommendationsData> {
  const res = await api.get<RecommendationsData>({
    path: "/api/mountains/recommendations",
    params: { lat, lng },
  });
  return res.data;
}

export function useMountainRecommendations(lat: number, lng: number) {
  return useQuery({
    queryKey: ["mountains/recommendations", lat, lng],
    queryFn: () => getMountainRecommendations(lat, lng),
    enabled: lat !== 0 && lng !== 0,
  });
}
