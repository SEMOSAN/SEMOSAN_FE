import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { HikingStartBanner } from '@/components/icons/hiking-start-banner';
import { InfoIcon } from '@/components/icons/info-icon';
import { type MountainRecommendationItem, useMountainRecommendations } from '@/features/mountains/hooks/use-mountain-recommendations';

const DIFFICULTY_LABEL: Record<MountainRecommendationItem["difficulty"], string> = {
  EASY: '난이도 하',
  NORMAL: '난이도 중',
  HARD: '난이도 상',
};

type Props = {
  userName?: string;
  scrollEnabled?: boolean;
  lat?: number;
  lng?: number;
};

export default function NoRecordBottomSheet({ userName = '맹쏘', scrollEnabled = false, lat = 0, lng = 0 }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = Math.round(90 * bannerWidth / 343);
  const { data } = useMountainRecommendations(lat, lng);
  const recommendations = data?.content ?? [];

  return (
    <View className="flex-1 w-full">
      {/* 섹션 1: 첫 등산 CTA */}
      <View style={{ marginHorizontal: 16, marginTop: 12 }}>
        <View>
          <HikingStartBanner width={bannerWidth} height={bannerHeight} />
        </View>
      </View>

      {/* 섹션 2: 레벨 맞는 산 추천 */}
      <View className="pt-4">
        <View className="flex-row items-center gap-0.5 px-4 mb-3">
          <Text className="typo-headline-1-semi-bold text-secondary-normal">{userName} </Text>
          <Text className="typo-headline-1-semi-bold text-label-normal">님의 레벨에 맞는</Text>
          <InfoIcon size={16.25} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-2"
          scrollEnabled={scrollEnabled}
        >
          {recommendations.map((mountain) => (
            <CuratedCard key={mountain.mountainId} mountain={mountain} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function CuratedCard({ mountain }: { mountain: MountainRecommendationItem }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="w-[164px] h-[160px] rounded-xl overflow-hidden bg-neutral-200"
      onPress={() =>
        router.push({
          pathname: '/mountain-info',
          params: {
            id: mountain.mountainId,
            name: mountain.name,
            difficulty: DIFFICULTY_LABEL[mountain.difficulty],
            elevation: `${Math.round(mountain.altitude)}m`,
          },
        })
      }
    >
      {mountain.imageUrl && (
        <Image
          source={{ uri: mountain.imageUrl }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.75)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />
      <View className="flex-1 justify-end p-3 gap-1">
        <Text className="typo-heading-1-semi-bold text-common-100" numberOfLines={1}>
          {mountain.name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text className="typo-caption-1-medium text-neutral-400">
            {DIFFICULTY_LABEL[mountain.difficulty]}
          </Text>
          <View className="w-1 h-1 rounded-full bg-neutral-400" />
          <Text className="typo-caption-1-medium text-neutral-400">
            {Math.round(mountain.altitude)}m
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

