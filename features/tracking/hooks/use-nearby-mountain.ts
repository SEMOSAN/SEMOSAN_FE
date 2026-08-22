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
    // 좌표가 트래킹 탭 진입 시 1회만 설정되므로 재조회해도 같은 결과 — 세션당 1회 조회 정책
    // (refetchOnReconnect는 기본값 유지: 최초 조회가 실패한 경우 네트워크 복구 시 재시도 필요)
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
