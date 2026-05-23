import { api } from '@/lib/api';
import { ENDPOINTS, NearbyMountainResponse } from '@/types/api.generated';
import { useQuery } from '@tanstack/react-query';

type Params = {
  lat: number | null;
  lng: number | null;
};

export function useNearbyMountain({ lat, lng }: Params) {
  return useQuery({
    queryKey: [ENDPOINTS.TRACKING_NEARBY_MOUNTAIN, lat, lng],
    queryFn: async () => {
      const res = await api.get<NearbyMountainResponse>({
        path: ENDPOINTS.TRACKING_NEARBY_MOUNTAIN,
        params: { lat: lat!, lng: lng! },
      });
      return res.data;
    },
    enabled: lat !== null && lng !== null,
    staleTime: 1000 * 60 * 5, // 5분
  });
}
