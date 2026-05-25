import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  GetUserHikingRecordSummaryResponse,
  ENDPOINTS,
} from "@/types/api.generated";

export function useHikingSummary() {
  return useQuery({
    queryKey: ["hiking-summary"],
    queryFn: async () => {
      const res = await api.get<GetUserHikingRecordSummaryResponse>({
        path: ENDPOINTS.HIKING_RECORDS_ME_SUMMARY,
      });
      return res.data;
    },
  });
}
