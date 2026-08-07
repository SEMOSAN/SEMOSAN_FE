import { api } from "@/lib/api";
import { ENDPOINTS, FreePostUpdateRequest } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdatePost(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FreePostUpdateRequest) =>
      api.put({ path: ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId), body }),
    onSuccess: () => {
      // 목록 + 해당 게시글 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId)],
      });
    },
  });
}
