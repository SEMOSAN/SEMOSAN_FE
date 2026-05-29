import { api } from "@/lib/api";
import { ENDPOINTS, FreePostReportRequest } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useReportPost(postId: number) {
  return useMutation({
    mutationFn: async (reason: FreePostReportRequest["reason"]) => {
      const { data } = await api.post({
        path: ENDPOINTS.COMMUNITY_FREE_POSTS_BY_POSTID_REPORTS(postId),
        body: { reason },
      });

      return data;
    },
  });
}
