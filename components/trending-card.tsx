import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, Text, View } from 'react-native';

export type TrendingMountain = {
  id: string;
  rank: number;
  name: string;
  tags: string[];
  imageUri?: string;
};

export const MOCK_TRENDING: TrendingMountain[] = [
  { id: '1', rank: 1, name: '산 이름', tags: ['태그1', '태그2'] },
  { id: '2', rank: 2, name: '산 이름', tags: ['태그1', '태그2'] },
  { id: '3', rank: 3, name: '산 이름', tags: ['태그1', '태그2'] },
  { id: '4', rank: 4, name: '산 이름', tags: ['태그1', '태그2'] },
];

export function TrendingCardList({ mountains = MOCK_TRENDING }: { mountains?: TrendingMountain[] }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-3"
    >
      {mountains.map((mountain) => (
        <TrendingCard key={mountain.id} mountain={mountain} />
      ))}
    </ScrollView>
  );
}

function TrendingCard({ mountain }: { mountain: TrendingMountain }) {
  const rankStr = String(mountain.rank).padStart(2, '0');

  return (
    <View className="w-[160px] h-[168px] rounded-xl overflow-hidden bg-neutral-300">
      {/* 배경 이미지 */}
      {mountain.imageUri && (
        <Image
          source={{ uri: mountain.imageUri }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      )}

      <LinearGradient
        colors={['rgba(0,0,0,0.09)', 'rgba(0,0,0,0.90)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="absolute inset-0"
      />

      {/* 하단 콘텐츠 */}
      <View className="flex-1 justify-end p-4 gap-2.5">
        {/* 순위 */}
        <Text className="typo-headline-1-semi-bold text-blue-400">
          {rankStr}
        </Text>

        <View className="gap-1">
          {/* 산 이름 */}
          <Text className="typo-heading-1-semi-bold text-common-100" numberOfLines={1}>
            {mountain.name}
          </Text>
          {/* 태그 */}
          <Text className="typo-body-2-normal-medium text-neutral-300" numberOfLines={1}>
            {mountain.tags.map((t) => `#${t}`).join(' ')}
          </Text>
        </View>
      </View>
    </View>
  );
}
