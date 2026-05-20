import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseMountainListResponse,
} from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

async function searchMountains(
  keyword: string,
): Promise<PageResponseMountainListResponse> {
  const res = await api.get<PageResponseMountainListResponse>({
    path: ENDPOINTS.MOUNTAINS_SEARCH,
    params: { keyword, size: 100 },
  });
  return res.data;
}

export function useMountainSearch(keyword: string) {
  return useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_SEARCH, keyword],
    queryFn: () => searchMountains(keyword),
    enabled: keyword.trim().length > 0,
  });
}
