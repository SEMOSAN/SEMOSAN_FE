import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { XIcon } from '@/components/icons/x-icon';

export default function CommunityPostCompleteScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill-normal">
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="h-14 flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <ChevronLeftIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <XIcon size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="items-center gap-2 py-5">
        <Text className="typo-title-2-bold text-label-normal">게시 완료</Text>
        <Text className="typo-headline-1-medium text-label-subtle">커뮤니티에 내 기록이 게시되었어요</Text>
      </View>

      <View className="items-center justify-center h-[296px]">
        <View
          className="w-[287px] h-[296px] items-center justify-center"
          style={{ backgroundColor: '#D9D9D9' }}
        >
          <Text className="typo-title-2-bold" style={{ color: '#898989' }}>그래픽 영역</Text>
        </View>
      </View>

      <View
        className="absolute left-0 right-0 bottom-0 bg-fill-normal pt-4 px-5"
        style={{ paddingBottom: Math.max(bottom, 20) }}
      >
        <TouchableOpacity
          className="h-14 rounded-xl bg-primary-normal items-center justify-center"
          onPress={() => router.replace('/(tabs)/community')}
        >
          <Text className="typo-label-large text-common-100">커뮤니티 보러가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
