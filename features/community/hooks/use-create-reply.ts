import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateReplyParams = {
  parentId: number;
  mentionedUserId?: number;
  content: string;
};

export function useCreateReply(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ parentId, mentionedUserId, content }: CreateReplyParams) =>
      api.post({
        path: ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS_REPLIES(postId),
        body: { parentId, mentionedUserId, content },
      }),
    onSuccess: (_, { parentId }) => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_COMMENTS_BY_COMMENTID_REPLIES(parentId)],
      });
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId)],
      });
    },
  });
}
