import { api } from "@/lib/api";
import { AppVersionResponse, ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

const REFETCH_INTERVAL_MS = 1000 * 60 * 30; // 30분마다 재확인

/**
 * 서버의 앱 버전/점검 정보를 주기적으로 조회한다.
 * - 30분 간격 폴링(포어그라운드) + 앱 포어그라운드 복귀 시 재확인(refetchOnWindowFocus)
 * - 실패/빈 응답이면 null → 게이트는 아무것도 막지 않음(fail-open)
 */
export function useAppVersion() {
  return useQuery({
    queryKey: [ENDPOINTS.APP_VERSION],
    queryFn: async (): Promise<AppVersionResponse | null> => {
      const res = await api.get<AppVersionResponse>({
        path: ENDPOINTS.APP_VERSION,
      });
      return res.data ?? null;
    },
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
    staleTime: 0,
    retry: 1,
  });
}
