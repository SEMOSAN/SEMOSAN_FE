import { api, ApiError } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { authState } from "@/store/auth.store";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { ENDPOINTS, RegisterOnboardingRequest } from "@/types/api.generated";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

export function useSubmitOnboarding() {
  const reset = useOnboardingStore((s) => s.reset);

  return useMutation({
    mutationFn: async (body: RegisterOnboardingRequest): Promise<void> => {
      await api.post({ path: ENDPOINTS.USERS_ONBOARDING, body }, { ignoreErrorToast: true });
    },
    onSuccess: async () => {
      await tokenStorage.setOnboardingPending(false);
      authState.setAuthenticated();
      reset();
    },
    onError: (error) => {
      const statusCode = error instanceof ApiError ? error.statusCode : undefined;
      // 409(이미 등록된 사용자)는 화면에서 정상 케이스로 처리하므로 노이즈 제외
      if (statusCode === 409) return;
      Sentry.captureException(error, {
        tags: { scope: "onboarding", operation: "submitOnboarding" },
        extra: { statusCode },
      });
    },
    mutationKey: [ENDPOINTS.USERS_ONBOARDING],
  });
}

