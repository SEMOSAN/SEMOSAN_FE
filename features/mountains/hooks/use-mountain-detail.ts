import { api } from "@/lib/api";
import { ENDPOINTS, MountainDetailResponse } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

async function getMountainDetail(
  mountainId: number,
): Promise<MountainDetailResponse> {
  const res = await api.get<MountainDetailResponse>({
    path: ENDPOINTS.MOUNTAINS_BY_MOUNTAINID(mountainId),
  });
  return res.data;
}

export function useMountainDetail(mountainId: number) {
  return useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_BY_MOUNTAINID(mountainId)],
    queryFn: () => getMountainDetail(mountainId),
  });
}
