import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostLikeCount(postId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_LIKES_COUNT(postId)],
    queryFn: async (): Promise<number> => {
      const res = await api.get<number>({
        path: ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_LIKES_COUNT(postId),
      });
      return res.data;
    },
  });
}

export function useTogglePostLike(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api.post({ path: ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_LIKES(postId) }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_POSTS_BY_POSTID_LIKES_COUNT(postId)],
      });
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID(postId)],
      });
    },
  });
}
