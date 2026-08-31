import { api } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";

/**
 * 세션에 이미 저장된 인증 사진 개수를 서버에서 조회한다.
 * 앱 재실행/강제 종료 후 재진입 시 라이브 액티비티의 "남은 사진 장수"를
 * 정확히 복원하기 위해 사용. 실패 시 0 반환(fail-open).
 */
export async function fetchSessionPhotoCount(
  sessionId: number,
): Promise<number> {
  try {
    const res = await api.get<unknown[]>({
      path: ENDPOINTS.TRACKING_SESSIONS_BY_SESSIONID_PHOTOS(sessionId),
    });
    return res.data?.length ?? 0;
  } catch {
    return 0;
  }
}
