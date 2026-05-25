import { api } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      await api.post({ path: ENDPOINTS.AUTH_LOGOUT }, { ignoreErrorToast: true });
    },
    onSettled: async () => {
      await tokenStorage.clearTokens();
      queryClient.clear();
    },
  });
}
