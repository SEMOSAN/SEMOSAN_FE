import { ChevronLeftIcon } from '@/components/icons/chevron-left-icon';
import { MountainBookmarkButton } from '@/features/mountains/components/mountain-bookmark-button';
import { DIFFICULTY_LABEL } from '@/features/mountains/components/mountain-card';
import { COURSE_BADGE } from '@/features/mountains/constants/course-badge';
import { useSavedMountains } from '@/features/mountains/hooks/use-saved-mountains';
import { LikedMountainResponse } from '@/types/api.generated';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SavedMountainItem({ mountain }: { mountain: LikedMountainResponse }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center bg-fill-normal"
      style={{ paddingHorizontal: 20, paddingVertical: 16, gap: 12 }}
      activeOpacity={0.7}
      onPress={() => router.push(`/mountains/${mountain.mountainId}`)}
    >
      {/* 썸네일 */}
      <Image
        source={mountain.imageUrls?.[0] ? { uri: mountain.imageUrls[0] } : undefined}
        className="bg-fill-stronger"
        style={{ width: 72, height: 72, borderRadius: 10 }}
        resizeMode="cover"
      />

      {/* 정보 */}
      <View style={{ flex: 1, gap: 6 }}>
        <View className="flex-row items-end" style={{ gap: 8 }}>
          <Text className="typo-headline-1-semi-bold text-label-normal shrink-0">
            {mountain.name}
          </Text>
          <Text
            className="typo-body-3-medium text-label-subtler shrink"
            style={{ paddingBottom: 2 }}
            numberOfLines={1}
          >
            {mountain.address}
          </Text>
        </View>
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <Text className="typo-body-3-medium text-label-subtle">
            고도 {mountain.altitude}m
          </Text>
          <View className="bg-label-subtler rounded-full" style={{ width: 2, height: 2 }} />
          {mountain.difficulty && (
            <Text
              className={`typo-body-3-semi-bold ${COURSE_BADGE[mountain.difficulty].style.text}`}
            >
              난이도 {DIFFICULTY_LABEL[mountain.difficulty]}
            </Text>
          )}
        </View>
      </View>

      {/* 북마크 버튼 */}
      {mountain.mountainId != null && (
        <MountainBookmarkButton mountainId={mountain.mountainId} mountainData={mountain} />
      )}
    </TouchableOpacity>
  );
}

function EmptyState() {
  return (
    <View className="flex-1 items-center justify-center" style={{ gap: 8 }}>
      <Text className="typo-body-1-normal-medium text-label-alternative">
        저장한 산이 없어요
      </Text>
      <Text className="typo-body-2-normal-regular text-label-subtler">
        마음에 드는 산을 저장해보세요
      </Text>
    </View>
  );
}

export default function SavedMountainsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, refetch } = useSavedMountains();

  // 화면 포커스될 때마다 최신 데이터 동기화
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  // 낙관적 업데이트로 임시 추가된 불완전한 항목(name 없는 항목) 필터링
  const mountains = (data?.content ?? []).filter((m) => !!m.name);

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

      {!isLoading && mountains.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={mountains}
          keyExtractor={(item) => String(item.mountainId)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          renderItem={({ item }) => <SavedMountainItem mountain={item} />}
        />
      )}
    </View>
  );
}
