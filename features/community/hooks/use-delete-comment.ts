import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(postId: number, parentCommentId?: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) =>
      api.delete({ path: ENDPOINTS.COMMUNITY_COMMENTS_BY_COMMENTID(commentId) }),
    onSuccess: () => {
      if (parentCommentId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: [
            ENDPOINTS.COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES(parentCommentId),
          ],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: [ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS(postId)],
        });
      }
    },
  });
}
