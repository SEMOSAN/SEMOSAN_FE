import { api } from '@/lib/api';
import { tokenStorage } from '@/lib/auth/tokenStorage';
import { ENDPOINTS } from '@/types/api.generated';
import { useMutation } from '@tanstack/react-query';

export function useWithdraw() {
  return useMutation({
    mutationFn: async () => {
      await api.delete({ path: ENDPOINTS.AUTH_WITHDRAW });
    },
    onSettled: async () => {
      await tokenStorage.clearTokens();
    },
  });
}
