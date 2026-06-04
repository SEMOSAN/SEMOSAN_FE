import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type RecordPhotoMarker = {
  milestoneIndex: number;
  lat: number;
  lng: number;
  imageUrl: string;
  capturedAt: string;
};

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
  temperature?: number;
  track?: string; // GeoJSON LineString
  photos?: RecordPhotoMarker[];
};

export function useHikingRecordDetail(hikingRecordId: number | null) {
  return useQuery({
    queryKey: ["hikingRecordDetail", hikingRecordId],
    enabled: hikingRecordId != null,
    queryFn: async () => {
      const res = await api.get<HikingRecordDetail>({
        path: `/api/hiking-records/${hikingRecordId}`,
      });
      console.log("[HikingRecordDetail]", JSON.stringify(res.data, null, 2));
      return res.data;
    },
  });
}
