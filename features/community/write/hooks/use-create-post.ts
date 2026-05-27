import { api } from "@/lib/api";
import { ENDPOINTS, FreePostCreateRequest } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost() {
  return useMutation({
    mutationFn: (body: FreePostCreateRequest) =>
      api.post({ path: ENDPOINTS.COMMUNITY_FREE_POSTS, body }),
  });
}
