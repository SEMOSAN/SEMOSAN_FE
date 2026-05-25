import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) =>
      api.post({
        path: ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS(postId),
        body: { content },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_COMMENTS(postId)],
      });
    },
  });
}
