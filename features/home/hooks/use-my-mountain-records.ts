import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseGetUserHikingRecordResponse,
} from "@/types/api.generated";

export function useMyMountainRecords(mountainId: number | null) {
  return useQuery({
    queryKey: ["myMountainRecords", mountainId],
    enabled: mountainId != null,
    queryFn: async () => {
      const res = await api.get<PageResponseGetUserHikingRecordResponse>({
        path: ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS_BY_MOUNTAINID(mountainId!),
        params: { size: 20 },
      });
      return res.data?.content ?? [];
    },
  });
}
