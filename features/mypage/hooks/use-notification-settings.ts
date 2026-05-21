import { api } from '@/lib/api';
import { ENDPOINTS } from '@/types/api.generated';
import { useQuery } from '@tanstack/react-query';

type NotificationSettings = {
  pushNotificationEnabled: boolean;
  liveActivityEnabled: boolean;
  voiceEnabled: boolean;
};

export function useNotificationSettings() {
  return useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const res = await api.get<NotificationSettings>({ path: ENDPOINTS.USERS_NOTIFICATION_SETTINGS });
      return res.data;
    },
    staleTime: 0,
  });
}
