import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseFreePostListResponse,
} from "@/types/api.generated";
import { useInfiniteQuery } from "@tanstack/react-query";

async function getFreePosts(
  page: number,
): Promise<PageResponseFreePostListResponse> {
  const res = await api.get<PageResponseFreePostListResponse>({
    path: ENDPOINTS.COMMUNITY_FREE_POSTS,
    params: { page, size: 20 },
  });
  return res.data;
}

export function useFreePosts() {
  return useInfiniteQuery({
    queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS],
    queryFn: ({ pageParam }) => getFreePosts(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : (lastPage.page ?? 0) + 1,
  });
}
