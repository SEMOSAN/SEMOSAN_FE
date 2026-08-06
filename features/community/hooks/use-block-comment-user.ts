import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useBlockCommentUser(commentId: number) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post({
        path: `/api/community/comments/${commentId}/blocks`,
      });

      return data;
    },
  });
}
