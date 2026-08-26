import { api } from "@/lib/api";
import { endSession } from "@/lib/auth/session";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post(
        { path: ENDPOINTS.AUTH_LOGOUT },
        { ignoreErrorToast: true },
      );
    },
    onSettled: endSession,
  });
}
