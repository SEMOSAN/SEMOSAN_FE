import { api } from "@/lib/api";
import { ENDPOINTS, PageResponseCommentResponse } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

export function usePostComments(postId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS(postId)],
    queryFn: async (): Promise<PageResponseCommentResponse> => {
      const res = await api.get<PageResponseCommentResponse>({
        path: ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS(postId),
      });
      return res.data;
    },
  });
}
