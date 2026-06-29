import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useBlockUser(postId: number) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post({
        path: ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID_BLOCKS(postId),
        body: {},
      });

      return data;
    },
  });
}
