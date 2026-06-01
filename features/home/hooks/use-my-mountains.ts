import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseGetUserHikingMountainRecordResponse,
} from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

export function useMyMountains() {
  return useQuery({
    queryKey: [ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS],
    queryFn: async () => {
      const res =
        await api.get<PageResponseGetUserHikingMountainRecordResponse>({
          path: ENDPOINTS.HIKING_RECORDS_ME_MOUNTAINS,
          params: { size: 20 },
        });
      return res.data?.content ?? [];
    },
  });
}
