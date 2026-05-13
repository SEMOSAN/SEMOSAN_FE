import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseLikedMountainResponse,
} from "@/types/api.generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const LIKES_KEY = [ENDPOINTS.MOUNTAINS_LIKES] as const;

async function getLikedMountains(): Promise<PageResponseLikedMountainResponse> {
  const res = await api.get<PageResponseLikedMountainResponse>({
    path: ENDPOINTS.MOUNTAINS_LIKES,
  });
  return res.data;
}

export function useMountainBookmark(mountainId: number) {
  const queryClient = useQueryClient();

  const { data: likedMountains } = useQuery({
    queryKey: LIKES_KEY,
    queryFn: getLikedMountains,
  });

  const isBookmarked =
    likedMountains?.content?.some((m) => m.mountainId === mountainId) ?? false;

  const like = useMutation({
    mutationFn: () =>
      api.post({ path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(mountainId) }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: LIKES_KEY });
      const previous =
        queryClient.getQueryData<PageResponseLikedMountainResponse>(LIKES_KEY);
      queryClient.setQueryData<PageResponseLikedMountainResponse>(
        LIKES_KEY,
        (old) => ({
          ...old,
          content: [...(old?.content ?? []), { mountainId }],
        }),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(LIKES_KEY, context?.previous);
    },
  });

  const unlike = useMutation({
    mutationFn: () =>
      api.delete({ path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(mountainId) }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: LIKES_KEY });
      const previous =
        queryClient.getQueryData<PageResponseLikedMountainResponse>(LIKES_KEY);
      queryClient.setQueryData<PageResponseLikedMountainResponse>(
        LIKES_KEY,
        (old) => ({
          ...old,
          content: old?.content?.filter((m) => m.mountainId !== mountainId) ?? [],
        }),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(LIKES_KEY, context?.previous);
    },
  });

  const isPending = like.isPending || unlike.isPending;

  function toggle() {
    if (isPending) return;
    if (isBookmarked) {
      unlike.mutate();
    } else {
      like.mutate();
    }
  }

  return { isBookmarked, isPending, toggle };
}
