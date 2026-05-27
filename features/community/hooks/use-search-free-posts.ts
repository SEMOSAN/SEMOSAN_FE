import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseFreePostListResponse,
} from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

async function searchFreePosts(
  keyword: string,
): Promise<PageResponseFreePostListResponse> {
  const res = await api.get<PageResponseFreePostListResponse>({
    path: ENDPOINTS.COMMUNITY_FREE_POSTS_SEARCH,
    params: { keyword, size: 20 },
  });
  return res.data;
}

export function useSearchFreePosts(keyword: string) {
  return useQuery({
    queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS_SEARCH, keyword],
    queryFn: () => searchFreePosts(keyword),
    enabled: keyword.trim().length > 0,
  });
}
