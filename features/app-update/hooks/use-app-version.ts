import { api } from "@/lib/api";
import { AppVersionResponse, ENDPOINTS } from "@/types/api.generated";
import { useQuery } from "@tanstack/react-query";

/**
 * 서버의 앱 버전/점검 정보를 앱 실행(콜드 스타트) 시 1회만 조회한다.
 * - 강제 업데이트는 대규모 업데이트에만 쓰이므로 폴링/포어그라운드 재확인 불필요
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
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
