import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.delete({ path: ENDPOINTS.AUTH_WITHDRAW });
    },
    onSettled: async () => {
      await tokenStorage.clearTokens();
      queryClient.clear();
    },
  });
}
