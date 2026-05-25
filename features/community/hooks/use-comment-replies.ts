import { api } from "@/lib/api";
import { CommentResponse, ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

export function useCommentReplies(commentId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES(commentId)],
    queryFn: async (): Promise<CommentResponse[]> => {
      const res = await api.get<CommentResponse[]>({
        path: ENDPOINTS.COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES(commentId),
      });
      return res.data;
    },
    enabled: !!commentId,
  });
}
