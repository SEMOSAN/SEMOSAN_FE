import { api } from '@/lib/api';
import { ENDPOINTS, UpdateUserProfileRequest } from '@/types/api.generated';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateUserProfileRequest) => {
      await api.patch({ path: ENDPOINTS.USERS_PROFILE, body: body as Record<string, unknown> });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
