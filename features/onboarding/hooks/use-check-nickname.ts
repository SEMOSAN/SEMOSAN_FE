import { api, ApiError } from "@/lib/api";
import { ENDPOINTS } from "@/types/api.generated";
import { useMutation } from "@tanstack/react-query";

export function useCheckNickname() {
  return useMutation({
    mutationFn: async (nickname: string): Promise<void> => {
      await api.get(
        { path: ENDPOINTS.USERS_NICKNAME, params: { nickname } },
        { ignoreErrorToast: true },
      );
    },
  });
}
