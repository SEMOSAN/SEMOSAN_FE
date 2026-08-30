import { api } from '@/lib/api';
import { ENDPOINTS } from '@/types/api.generated';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type NotificationKey = 'push' | 'liveActivity';

const ENDPOINT_MAP: Record<NotificationKey, string> = {
  push: ENDPOINTS.USERS_NOTIFICATION_SETTINGS_PUSH,
  liveActivity: ENDPOINTS.USERS_NOTIFICATION_SETTINGS_LIVE_ACTIVITY,
};

export function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, enabled }: { key: NotificationKey; enabled: boolean }) => {
      await api.patch({
        path: ENDPOINT_MAP[key],
        body: { enabled },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });
}
