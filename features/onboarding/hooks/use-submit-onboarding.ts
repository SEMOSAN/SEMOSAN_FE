import { api } from "@/lib/api";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { ENDPOINTS, RegisterOnboardingRequest } from "@/types/api.generated";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

export function useSubmitOnboarding() {
  const reset = useOnboardingStore((s) => s.reset);

  return useMutation({
    mutationFn: async (body: RegisterOnboardingRequest): Promise<void> => {
      await api.post({ path: ENDPOINTS.USERS_ONBOARDING, body }, { ignoreErrorToast: true });
    },
    onSuccess: () => {
      reset();
    },
    mutationKey: [ENDPOINTS.USERS_ONBOARDING],
  });
}

export function useSubmitOnboardingFromStore() {
  const toRequest = useOnboardingStore((s) => s.toRequest);
  const { mutateAsync, ...rest } = useSubmitOnboarding();

  async function submit(): Promise<void> {
    const request = toRequest();
    if (!request) return;
    await mutateAsync(request);
  }

  return { submit, ...rest };
}
