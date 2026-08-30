import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { authState, AuthStatus, useAuthStore } from "@/store/auth.store";
import { ENDPOINTS, GetUserProfileResponse } from "@/types/api.generated";
import { useEffect } from "react";

/**
 * 앱 시작 시 저장된 토큰을 1회 검증하고, 이후에는 전역 스토어의 인증 상태를 그대로 구독한다.
 * 로컬 state 로 두면 로그인 성공 이후에도 상태가 unauthenticated 로 남아
 * 루트의 `<Redirect href="/login" />` 이 계속 로그인 화면으로 되돌린다.
 */
export function useAuthState(): { status: AuthStatus } {
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    async function bootstrap(): Promise<void> {
      await tokenStorage.seedSampleAccessToken();

      const token = await tokenStorage.getAccessToken();
      if (!token) {
        authState.setUnauthenticated();
        return;
      }

      try {
        await api.get<GetUserProfileResponse>(
          { path: ENDPOINTS.USERS_PROFILE },
          { ignoreErrorToast: true },
        );
        const onboardingPending = await tokenStorage.isOnboardingPending();
        if (onboardingPending === null) {
          authState.setUnauthenticated();
          return;
        }
        if (onboardingPending) {
          authState.setNeedsOnboarding();
        } else {
          authState.setAuthenticated();
        }
      } catch {
        authState.setUnauthenticated();
      }
    }

    bootstrap();
  }, []);

  return { status };
}
