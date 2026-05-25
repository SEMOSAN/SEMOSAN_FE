import { api } from "@/lib/api";
import { ENDPOINTS, FreePostDetailResponse } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

export function useFreePostDetail(postId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId)],
    queryFn: async (): Promise<FreePostDetailResponse> => {
      const res = await api.get<FreePostDetailResponse>({
        path: ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId),
      });
      return res.data;
    },
  });
}
