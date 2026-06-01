import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type BBox = {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
} | null;

export type MountainMapItem = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  visited: boolean;
  visitCount: number;
  imageUrl?: string;
};

type MountainMapData = {
  hasHikingRecord: boolean;
  mountains: MountainMapItem[];
};

async function getMountainsMap(bbox: BBox): Promise<MountainMapData> {
  const params: Record<string, number> = bbox
    ? {
        swLat: bbox.swLat,
        swLng: bbox.swLng,
        neLat: bbox.neLat,
        neLng: bbox.neLng,
      }
    : {};
  const res = await api.get<MountainMapData>({
    path: ENDPOINTS.MOUNTAINS_MAP,
    params,
  });
  return res.data;
}

export function useMountainsMap(bbox: BBox) {
  return useQuery({
    queryKey: [ENDPOINTS.MOUNTAINS_MAP, bbox],
    queryFn: () => getMountainsMap(bbox),
    placeholderData: keepPreviousData,
  });
}
