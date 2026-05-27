import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseSemoFeedResponse,
} from "@/types/api.generated";
import { useInfiniteQuery } from "@tanstack/react-query";

async function getSemofeed(
  page: number,
): Promise<PageResponseSemoFeedResponse> {
  const res = await api.get<PageResponseSemoFeedResponse>({
    path: ENDPOINTS.SEMOFEED,
    params: { page, size: 20 },
  });
  return res.data;
}

export function useSemofeed() {
  return useInfiniteQuery({
    queryKey: [ENDPOINTS.SEMOFEED],
    queryFn: ({ pageParam }) => getSemofeed(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : (lastPage.page ?? 0) + 1,
  });
}
