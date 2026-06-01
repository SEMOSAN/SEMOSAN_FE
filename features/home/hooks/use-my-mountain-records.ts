import { api } from "@/lib/api";
import {
  ENDPOINTS,
  GetUserHikingRecordResponse,
  PageResponseGetUserHikingRecordResponse,
} from "@/types/api.generated";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function useMyMountainRecords(
  mountainId?: number,
): UseQueryResult<GetUserHikingRecordResponse[]> {
  return useQuery({
    queryKey: [
      ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID(mountainId!),
    ],
    enabled: mountainId !== undefined,
    queryFn: async () => {
      const res = await api.get<PageResponseGetUserHikingRecordResponse>({
        path: ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID(mountainId!),
        params: { size: 20 },
      });
      return res.data?.content ?? [];
    },
  });
}
