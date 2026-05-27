import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.delete({ path: ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS],
      });
    },
  });
}
