import {
  registerFcmToken,
  resetFcmTokenRegistration,
} from "@/features/notifications/register-fcm-token";
import { queryClient } from "@/lib/query-client";
import { authState } from "@/store/auth.store";
import * as Notifications from "expo-notifications";
import { tokenStorage } from "./tokenStorage";

/**
 * 세션 종료 단일 경로. 로그아웃 / 탈퇴 / 토큰 재발급 실패 모두 여기를 통한다.
 * 토큰 폐기 + 캐시 정리 + 인증 상태 전환까지 한 번에 처리해서
 * 죽은 토큰으로 API를 계속 호출하거나 이전 계정 데이터가 남는 상황을 막는다.
 */
export async function endSession(): Promise<void> {
  await tokenStorage.clearTokens();
  queryClient.clear();
  // 앱 아이콘 뱃지는 로그아웃해도 OS에 남는다
  await Notifications.setBadgeCountAsync(0).catch(() => {});
  resetFcmTokenRegistration();
  authState.setUnauthenticated();
}

/**
 * 로그인 성공 직후 호출. 토큰 저장 후 인증 상태를 켠다.
 * onboardingCompleted 가 false 면, 다음 앱 재시작 시에도 온보딩 화면으로
 * 돌아갈 수 있도록 로컬에 "온보딩 미완료" 표시를 남겨둔다.
 */
export async function startSession(
  accessToken: string,
  refreshToken: string,
  onboardingCompleted: boolean,
): Promise<void> {
  await tokenStorage.setTokens(accessToken, refreshToken);
  await tokenStorage.setOnboardingPending(!onboardingCompleted);

  // 서버가 로그인 시점에 이 유저의 FCM 토큰을 정리하므로 매번 다시 등록한다.
  // 화면 전환을 네트워크에 묶지 않도록 기다리지 않는다(실패는 내부에서 처리).
  void registerFcmToken({ requestPermission: false });

  if (onboardingCompleted) {
    authState.setAuthenticated();
  } else {
    authState.setNeedsOnboarding();
  }
}
