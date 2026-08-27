import { api } from "@/lib/api";
import { endSession } from "@/lib/auth/session";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useWithdraw() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete(
        { path: ENDPOINTS.AUTH_WITHDRAW },
        { ignoreErrorToast: true },
      );
    },
    onSettled: endSession,
  });
}
