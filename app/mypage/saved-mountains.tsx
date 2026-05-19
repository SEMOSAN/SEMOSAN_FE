import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import {
  DIFFICULTY_STYLE,
  MOCK_MOUNTAINS,
  type Mountain,
} from '@/features/mountains/components/mountain-card';
import { useRouter } from 'expo-router';

import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 목 데이터: 저장된 산 목록 (MOCK_MOUNTAINS 전체를 저장된 상태로 사용)
const MOCK_SAVED_MOUNTAINS: Mountain[] = MOCK_MOUNTAINS;

function BookmarkIcon() {
  return (
    <Svg width={14} height={19} viewBox="0 0 14 19" fill="none">
      <Path
        d="M12 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V18C6.65975e-05 18.1338 0.0359509 18.2652 0.103929 18.3805C0.171907 18.4958 0.269503 18.5908 0.386587 18.6557C0.503672 18.7206 0.635979 18.7529 0.76978 18.7494C0.90358 18.7458 1.034 18.7066 1.1475 18.6356L6.75 15.1341L12.3534 18.6356C12.4669 18.7063 12.5972 18.7454 12.7309 18.7488C12.8646 18.7522 12.9967 18.7198 13.1136 18.655C13.2306 18.5902 13.3281 18.4953 13.396 18.3801C13.4639 18.2649 13.4998 18.1337 13.5 18V1.5C13.5 1.10218 13.342 0.720644 13.0607 0.43934C12.7794 0.158035 12.3978 0 12 0Z"
        fill="#73798C"
      />
    </Svg>
  );
}

function SavedMountainItem({ mountain }: { mountain: Mountain }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="flex-row items-center bg-fill-normal"
      style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}
      activeOpacity={0.7}
      onPress={() => router.push(`/mountains/${mountain.id}`)}
    >
      {/* 썸네일 */}
      <Image
        source={mountain.imageUrl ? { uri: mountain.imageUrl } : undefined}
        className="bg-fill-stronger"
        style={{ width: 72, height: 72, borderRadius: 10 }}
        resizeMode="cover"
      />

      {/* 정보 */}
      <View style={{ flex: 1, gap: 6 }}>
        <View className="flex-row items-end" style={{ gap: 8 }}>
          <Text className="typo-headline-1-semi-bold text-label-normal">
            {mountain.name}
          </Text>
          <Text
            className="typo-body-3-medium text-label-subtler"
            style={{ paddingBottom: 2 }}
          >
            {mountain.location}
          </Text>
        </View>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Text className="typo-body-3-medium text-label-subtle">
            고도 {mountain.altitude}m
          </Text>
          <View
            className="bg-label-subtler rounded-full"
            style={{ width: 2, height: 2 }}
          />
          <Text
            className={`typo-body-3-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}
          >
            난이도 {mountain.difficulty}
          </Text>
        </View>
      </View>

      {/* 북마크 버튼 */}
      <TouchableOpacity
        onPress={() => setSaved((prev) => !prev)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <BookmarkIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SavedMountainsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <Text className="typo-headline-1-semi-bold text-label-normal">
          저장한 산 목록
        </Text>
      </View>

      <FlatList
        data={MOCK_SAVED_MOUNTAINS}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
        renderItem={({ item }) => <SavedMountainItem mountain={item} />}
      />
    </View>
  );
}
