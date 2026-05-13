import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseLikedMountainResponse,
} from "@/types/api.generated";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

async function getLikedMountains(): Promise<PageResponseLikedMountainResponse> {
  const res = await api.get<PageResponseLikedMountainResponse>({
    path: ENDPOINTS.MOUNTAINS_LIKES,
  });
  return res.data;
}

export function useMountainBookmark(mountainId: number) {
  const queryClient = useQueryClient();

  const { data: likedMountains } = useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_LIKES],
    queryFn: getLikedMountains,
  });

  const isBookmarked =
    likedMountains?.content?.some((m) => m.mountainId === mountainId) ?? false;

  // TODO : api호출수 줄이기위해 invalidate하지말고 캐시값 조작으로 변경
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [ENDPOINTS.MOUNTAINS_LIKES] });

  const like = useMutation({
    mutationFn: () =>
      api.post({ path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(mountainId) }),
    onSuccess: invalidate,
  });

  const unlike = useMutation({
    mutationFn: () =>
      api.delete({ path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID_LIKE(mountainId) }),
    onSuccess: invalidate,
  });

  return { isBookmarked, like, unlike };
}
