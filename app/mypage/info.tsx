import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { MenuChevronIcon } from '@/features/mypage/components/menu-chevron-icon';
import { MenuRow } from '@/features/mypage/components/menu-row';
import { ProfileAvatar } from '@/features/mypage/components/profile-avatar';
import { MOCK_USER } from '@/features/mypage/constants';
import { useRouter } from 'expo-router';
import { Path, Svg } from 'react-native-svg';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyPageInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profileItems = [
    { label: '성별', value: MOCK_USER.gender },
    { label: '나이', value: MOCK_USER.age },
    { label: '키', value: MOCK_USER.height },
    { label: '체중', value: MOCK_USER.weight },
    { label: '운동 경험', value: MOCK_USER.exercise },
  ];

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View
        className="flex-row items-center justify-between bg-fill-normal"
        style={{ height: 56, paddingHorizontal: 20, marginTop: insets.top }}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.6}>
          <ChevronLeftIcon size={24} color="#1a1b1f" />
        </TouchableOpacity>
        <Text className="typo-headline-1-semi-bold text-label-normal text-center">내 정보</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 프로필 아바타 */}
        <View className="items-center pt-8 pb-8">
          <View>
            <ProfileAvatar />
            {/* + 버튼 */}
            <View
              className="absolute bg-label-normal rounded-full items-center justify-center"
              style={{ width: 32, height: 32, bottom: 0, right: 0 }}
            >
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path
                  d="M14 8C14 8.13261 13.9473 8.25979 13.8536 8.35355C13.7598 8.44732 13.6326 8.5 13.5 8.5H8.5V13.5C8.5 13.6326 8.44732 13.7598 8.35355 13.8536C8.25979 13.9473 8.13261 14 8 14C7.86739 14 7.74021 13.9473 7.64645 13.8536C7.55268 13.7598 7.5 13.6326 7.5 13.5V8.5H2.5C2.36739 8.5 2.24021 8.44732 2.14645 8.35355C2.05268 8.25979 2 8.13261 2 8C2 7.86739 2.05268 7.74021 2.14645 7.64645C2.24021 7.55268 2.36739 7.5 2.5 7.5H7.5V2.5C7.5 2.36739 7.55268 2.24021 7.64645 2.14645C7.74021 2.05268 7.86739 2 8 2C8.13261 2 8.25979 2.05268 8.35355 2.14645C8.44732 2.24021 8.5 2.36739 8.5 2.5V7.5H13.5C13.6326 7.5 13.7598 7.55268 13.8536 7.64645C13.9473 7.74021 14 7.86739 14 8Z"
                  fill="white"
                />
              </Svg>
            </View>
          </View>
        </View>

        {/* 닉네임 */}
        <View className="px-5">
          <TouchableOpacity
            className="flex-row items-center justify-between bg-fill-strong"
            style={{ paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16 }}
            activeOpacity={0.6}
            onPress={() => {}}
          >
            <Text className="typo-body-1-normal-medium text-label-normal" style={{ letterSpacing: -0.16 }}>
              닉네임
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="typo-body-1-normal-regular text-label-alternative">
                {MOCK_USER.name}
              </Text>
              <MenuChevronIcon />
            </View>
          </TouchableOpacity>
        </View>

        {/* 프로필 정보 */}
        <View className="px-5 pt-3">
          <View className="bg-fill-strong rounded-2xl overflow-hidden">
            {profileItems.map((item) => (
              <MenuRow
                key={item.label}
                label={item.label}
                value={item.value}
                onPress={() => {}}
              />
            ))}
          </View>
        </View>

        <View style={{ height: insets.bottom + 16 }} />
      </ScrollView>
    </View>
  );
}
