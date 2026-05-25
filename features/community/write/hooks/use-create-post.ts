import { api } from "@/lib/api";
import { ENDPOINTS, FreePostCreateRequest } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FreePostCreateRequest) =>
      api.post({ path: ENDPOINTS.COMMUNITY_FREE_POSTS, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ENDPOINTS.COMMUNITY_FREE_POSTS],
      });
    },
  });
}
