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
  {
    id: '1', rank: 1, name: '북한산',
    tags: ['초보 가능', '단풍 명소'],
    imageUri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2', rank: 2, name: '인왕산',
    tags: ['서울 야경', '접근 쉬움'],
    imageUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3', rank: 3, name: '청계산',
    tags: ['가족 코스', '맑은 계곡'],
    imageUri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4', rank: 4, name: '관악산',
    tags: ['암릉 코스', '전망 좋음'],
    imageUri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5', rank: 5, name: '도봉산',
    tags: ['바위 능선', '사계절 명산'],
    imageUri: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
  },
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
