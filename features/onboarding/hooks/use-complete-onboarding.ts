import { useSubmitOnboardingFromStore } from "@/features/onboarding/store/use-submit-onboarding-from-store";
import { ApiError } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { authState } from "@/store/auth.store";
import { toast } from "@/store/toast.store";
import { router } from "expo-router";

export function useCompleteOnboarding() {
  const { submit, isPending } = useSubmitOnboardingFromStore();

  async function complete(): Promise<void> {
    try {
      await submit();
      router.replace("/(tabs)");
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 409) {
        const saved = await tokenStorage.setOnboardingPending(false);
        if (!saved) {
          toast.show("잠시후 다시 시도해주십시오.");
          return;
        }
        authState.setAuthenticated();
        toast.show("이미 등록된 사용자입니다.");
        router.replace("/(tabs)");
      } else {
        toast.show("잠시후 다시 시도해주십시오.");
      }
    }
  }

  return { complete, isPending };
}
