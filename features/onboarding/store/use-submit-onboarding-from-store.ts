import { useSubmitOnboarding } from "@/features/onboarding/hooks/use-submit-onboarding";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";

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
