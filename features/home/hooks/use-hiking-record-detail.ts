import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type HikingRecordDetail = {
  hikingRecordId: number;
  distanceMeters?: number;
  durationSeconds?: number;
  maxAltitudeMeters?: number;
  ascentMeters?: number;
  descentMeters?: number;
  calories?: number;
  startedAt?: string;
  endedAt?: string;
};

export function useHikingRecordDetail(hikingRecordId: number | null) {
  return useQuery({
    queryKey: ["hikingRecordDetail", hikingRecordId],
    enabled: hikingRecordId != null,
    queryFn: async () => {
      const res = await api.get<HikingRecordDetail>({
        path: `/api/hiking-records/${hikingRecordId}`,
      });
      return res.data;
    },
  });
}
