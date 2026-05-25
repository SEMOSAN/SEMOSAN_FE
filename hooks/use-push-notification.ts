import { api } from '@/lib/api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// 포어그라운드에서도 알림 표시
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * 앱 시작 시 FCM 토큰을 서버에 등록하고
 * 포어그라운드 알림 수신 및 알림 탭 이벤트를 처리하는 훅
 */
export function usePushNotification(enabled = true): void {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    registerFcmToken();

    // 포어그라운드 알림 수신 (필요 시 인앱 UI 처리)
    const foregroundSub = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('[Push] 포어그라운드 수신:', notification);
      },
    );

    // 알림 탭 → 화면 이동
    const tapSub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as PushData;
        navigateByType(data, router);
      },
    );

    // 앱이 종료된 상태에서 알림 탭으로 열린 경우
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data as PushData;
      navigateByType(data, router);
    });

    return () => {
      foregroundSub.remove();
      tapSub.remove();
    };
  }, [router, enabled]);
}

// ─── 타입 ───────────────────────────────────────────────────

type PushData = {
  type: NotificationType;
  notificationId?: string;
  extras?: string; // JSON 문자열
};

// 백엔드 NotificationType enum과 동기화
type NotificationType =
  | 'COMMUNITY_COMMENT'
  | 'COMMUNITY_REPLY'
  | 'COMMUNITY_LIKE'
  | 'COMMUNITY_MENTION'
  | 'FOLLOW_RECEIVED'
  | 'HIKING_INVITE'
  | 'HIKING_INVITE_ACCEPTED'
  | 'HIKING_STARTED'
  | 'HIKING_MEMBER_JOINED'
  | 'HIKING_MEMBER_LEFT'
  | 'HIKING_NEAR_DESTINATION'
  | 'HIKING_OFF_TRAIL'
  | 'HIKING_FINISHED'
  | 'HIKING_CHAT'
  | 'EMERGENCY_SOS'
  | 'WEATHER_WARNING'
  | 'TRAIL_CLOSED'
  | 'SYSTEM_NOTICE'
  | 'SYSTEM_MAINTENANCE'
  | 'APP_UPDATE'
  | 'TRACKING_PHOTO_MILESTONE';

// ─── FCM 토큰 등록 ───────────────────────────────────────────

async function registerFcmToken() {
  if (!Device.isDevice) {
    console.log('[Push] 실기기에서만 토큰 등록 가능');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('[Push] 알림 권한 거부됨');
    return;
  }

  try {
    const { data: token } = await Notifications.getDevicePushTokenAsync();

    await api.post({
      path: '/api/fcm/tokens',
      body: {
        token,
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      },
    });

    console.log('[Push] FCM 토큰 등록 완료');
  } catch (error) {
    console.error('[Push] FCM 토큰 등록 실패:', error);
  }
}

// ─── 알림 탭 라우팅 ──────────────────────────────────────────

function navigateByType(
  data: PushData,
  router: ReturnType<typeof useRouter>,
) {
  const extras = data.extras ? JSON.parse(data.extras) : {};
  // expo-router typedRoutes 미등록 경로는 as any로 우회
  // 해당 화면 구현 시 타입 제거 가능
  const push = (path: string) => router.push(path as any);

  switch (data.type) {
    case 'COMMUNITY_COMMENT':
    case 'COMMUNITY_REPLY':
    case 'COMMUNITY_LIKE':
    case 'COMMUNITY_MENTION':
      push(`/community/${extras.postId}`);
      break;

    case 'FOLLOW_RECEIVED':
      push(`/profile/${extras.actorId}`);
      break;

    case 'HIKING_INVITE':
    case 'HIKING_INVITE_ACCEPTED':
    case 'HIKING_STARTED':
    case 'HIKING_MEMBER_JOINED':
    case 'HIKING_MEMBER_LEFT':
    case 'HIKING_NEAR_DESTINATION':
    case 'HIKING_OFF_TRAIL':
    case 'HIKING_FINISHED':
    case 'HIKING_CHAT':
    case 'EMERGENCY_SOS':
    case 'TRACKING_PHOTO_MILESTONE':
      router.push('/(tabs)/tracking');
      break;

    case 'SYSTEM_NOTICE':
    case 'SYSTEM_MAINTENANCE':
    case 'APP_UPDATE':
    case 'WEATHER_WARNING':
    case 'TRAIL_CLOSED':
      push('/notification');
      break;

    default:
      push('/notification');
  }
}
