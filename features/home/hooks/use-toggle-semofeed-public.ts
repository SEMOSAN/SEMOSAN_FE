import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, UseMutationResult } from "@tanstack/react-query";

export function useToggleSemofeedPublic(): UseMutationResult<
  Awaited<ReturnType<typeof api.patch<boolean>>>,
  Error,
  number
> {
  return useMutation({
    mutationFn: (semoFeedId: number) =>
      api.patch<boolean>({
        path: ENDPOINTS.SEMOFEED_BY_SEMOFEEDID_PUBLIC(semoFeedId),
      }),
  });
}
