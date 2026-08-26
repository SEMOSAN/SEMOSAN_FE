import { queryClient } from "@/lib/query-client";
import { authState } from "@/store/auth.store";
import { tokenStorage } from "./tokenStorage";

/**
 * 세션 종료 단일 경로. 로그아웃 / 탈퇴 / 토큰 재발급 실패 모두 여기를 통한다.
 * 토큰 폐기 + 캐시 정리 + 인증 상태 전환까지 한 번에 처리해서
 * 죽은 토큰으로 API를 계속 호출하거나 이전 계정 데이터가 남는 상황을 막는다.
 */
export async function endSession(): Promise<void> {
  await tokenStorage.clearTokens();
  queryClient.clear();
  authState.setUnauthenticated();
}

/** 로그인 성공 직후 호출. 토큰 저장 후 인증 상태를 켠다. */
export async function startSession(
  accessToken: string,
  refreshToken: string,
): Promise<void> {
  await tokenStorage.setTokens(accessToken, refreshToken);
  authState.setAuthenticated();
}
