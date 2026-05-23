import { api } from "@/lib/api";
import { ENDPOINTS, RegisterOnboardingRequest } from "@/types/api.generated";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";

export function useSubmitOnboarding() {
  return useMutation({
    mutationFn: async (body: RegisterOnboardingRequest): Promise<void> => {
      await api.post({ path: ENDPOINTS.USERS_ONBOARDING, body });
    },
    onSuccess: () => {
      router.replace("/(tabs)");
    },
  });
}
