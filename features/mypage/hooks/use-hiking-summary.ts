import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  ApiResponseGetUserHikingRecordSummaryResponse,
  ENDPOINTS,
} from "@/types/api.generated";

export function useHikingSummary() {
  return useQuery({
    queryKey: ["hiking-summary"],
    queryFn: async () => {
      const res = await api.get<ApiResponseGetUserHikingRecordSummaryResponse>({
        path: ENDPOINTS.HIKING_RECORDS_ME_SUMMARY,
      });
      return res.data;
    },
  });
}
