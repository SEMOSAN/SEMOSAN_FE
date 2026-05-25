import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { useNotificationSettings } from '@/features/mypage/hooks/use-notification-settings';
import { useUpdateNotification } from '@/features/mypage/hooks/use-update-notification';
import { toast } from '@/store/toast.store';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Animated, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 토큰 기반 상수
const TRACK_WIDTH = 44;
const TRACK_HEIGHT = 24;
const THUMB_SIZE = 20;
const THUMB_PADDING = 2;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - THUMB_PADDING * 2; // 20

const COLOR_ON = '#2F323A';   // fill-heavy
const COLOR_OFF = '#F0F2F4';  // fill-stronger
const COLOR_THUMB = '#FFFFFF'; // fill-normal

function ToggleSwitch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const thumbLeft = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [THUMB_PADDING, THUMB_PADDING + THUMB_TRAVEL],
  });

  const trackColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLOR_OFF, COLOR_ON],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: 9999,
          backgroundColor: trackColor,
          justifyContent: 'center',
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            left: thumbLeft,
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            borderRadius: 9999,
            backgroundColor: COLOR_THUMB,
            boxShadow: '0px 4px 6px 0px rgba(0, 0, 0, 0.1)',
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

type NotificationKey = 'push' | 'liveActivity' | 'voice';

const NOTIFICATION_ITEMS: { key: NotificationKey; label: string; toastMessage: string }[] = [
  { key: 'push', label: '푸시 알림', toastMessage: '푸시 알림을 활성화했어요' },
  { key: 'liveActivity', label: '라이브 액티비티', toastMessage: '라이브 액티비티를 활성화했어요' },
  { key: 'voice', label: '음성 안내', toastMessage: '음성 안내를 활성화했어요' },
];

const DEVICE_PERMISSION_KEYS = [
  '위치 서비스',
  // '카메라', // 앱 심사 시 비활성화
] as const;

export default function PermissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: settings } = useNotificationSettings();
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    push: false,
    liveActivity: false,
    voice: false,
  });

  useEffect(() => {
    if (!settings) return;
    setNotifications({
      push: settings.pushNotificationEnabled,
      liveActivity: settings.liveActivityEnabled,
      voice: settings.voiceEnabled,
    });
  }, [settings]);

  const { mutate: updateNotification } = useUpdateNotification();

  const [locationStatus, setLocationStatus] = useState<string>('확인 중');
  const [cameraStatus, setCameraStatus] = useState<string>('확인 중');

  useEffect(() => {
    Location.getForegroundPermissionsAsync().then(({ status }) => {
      setLocationStatus(status === 'granted' ? '허용됨' : '허용 안 함');
    });
    ImagePicker.getCameraPermissionsAsync().then(({ status }) => {
      setCameraStatus(status === 'granted' ? '허용됨' : '허용 안 함');
    });
  }, []);

  const handleToggle = (key: NotificationKey, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    updateNotification({ key, enabled: value });
    if (value) {
      const item = NOTIFICATION_ITEMS.find((i) => i.key === key);
      if (item) toast.show(item.toastMessage);
    }
  };

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View
        className="flex-row items-center bg-fill-normal"
        style={{ height: 56, paddingHorizontal: 20, gap: 8, marginTop: insets.top }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
          <ChevronLeftIcon size={24} color="#1a1b1f" />
        </TouchableOpacity>
        <Text className="typo-headline-1-semi-bold text-label-normal">권한 관리</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 알림 설정 */}
        <View style={{ paddingTop: 12, paddingBottom: 6, paddingHorizontal: 20, gap: 10, alignSelf: 'stretch' }}>
          <Text className="typo-body-2-normal-semi-bold text-label-subtler" style={{ letterSpacing: -0.14 }}>
            알림 설정
          </Text>
        </View>

        <View className="bg-fill-normal">
          {NOTIFICATION_ITEMS.map((item) => (
            <View
              key={item.key}
              className="flex-row items-center justify-between"
              style={{ paddingHorizontal: 20, paddingVertical: 16 }}
            >
              <Text className="typo-body-1-normal-regular text-label-normal" style={{ letterSpacing: -0.16 }}>
                {item.label}
              </Text>
              <ToggleSwitch
                value={notifications[item.key]}
                onValueChange={(v) => handleToggle(item.key, v)}
              />
            </View>
          ))}
        </View>

        {/* 섹션 구분선 */}
        <View className="bg-fill-strong" style={{ height: 6 }} />

        {/* 기기 권한 */}
        <View style={{ paddingTop: 12, paddingBottom: 6, paddingHorizontal: 20, gap: 10, alignSelf: 'stretch' }}>
          <Text className="typo-body-2-normal-semi-bold text-label-subtler" style={{ letterSpacing: -0.14 }}>
            기기 권한
          </Text>
        </View>

        <View className="bg-fill-normal">
          {DEVICE_PERMISSION_KEYS.map((label) => {
            const statusText = label === '위치 서비스' ? locationStatus : cameraStatus;
            return (
              <TouchableOpacity
                key={label}
                className="flex-row items-center justify-between"
                style={{ paddingHorizontal: 20, paddingVertical: 16 }}
                activeOpacity={0.6}
                onPress={() => Linking.openSettings()}
              >
                <Text className="typo-body-1-normal-regular text-label-normal" style={{ letterSpacing: -0.16 }}>
                  {label}
                </Text>
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <Text className="typo-body-1-normal-regular text-label-alternative" style={{ letterSpacing: -0.16 }}>
                    {statusText}
                  </Text>
                  <View style={{ transform: [{ rotate: '180deg' }] }}>
                    <ChevronLeftIcon size={16} color="#9CA3AF" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}
