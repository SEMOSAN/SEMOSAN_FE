import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
// 백그라운드 위치 태스크 — 앱 시작 전에 등록되어야 함
import './features/tracking/tasks/location-task';

// 백그라운드/종료 상태에서 FCM 수신 처리
// expo-router/entry보다 먼저 등록되어야 함 (require로 호이스팅 방지)
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const data = remoteMessage.data;

  // 핸들러 실행 확인용 — 타입 관계없이 뱃지 증가
  await Notifications.setBadgeCountAsync(1);

  if (!data || data.type !== 'TRACKING_PHOTO_MILESTONE') return;

  const distance = parseFloat(data.distance ?? '0');

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'SEMOSAN',
      body: `${Math.round(distance)}m 돌파! 인증 사진을 남겨보세요!`,
    },
    trigger: null,
  });
});

require('expo-router/entry');
