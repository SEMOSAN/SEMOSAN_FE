import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ENDPOINTS,
  PageResponseGetUserHikingMountainRecordResponse,
} from "@/types/api.generated";

export function useMyMountains() {
  return useQuery({
    queryKey: ["myMountains"],
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
