import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { HikingStartBanner } from '@/components/icons/hiking-start-banner';
import { InfoIcon } from '@/components/icons/info-icon';

type CuratedMountain = {
  id: string;
  name: string;
  difficulty: string;
  elevation: string;
  imageUri?: string;
};

const MOCK_CURATED: CuratedMountain[] = [
  {
    id: '1',
    name: '인왕산',
    difficulty: '난이도 하',
    elevation: '338m',
    imageUri: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '2',
    name: '청계산',
    difficulty: '난이도 중',
    elevation: '618m',
    imageUri: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    name: '수락산',
    difficulty: '난이도 중',
    elevation: '638m',
    imageUri: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    name: '불암산',
    difficulty: '난이도 하',
    elevation: '507m',
    imageUri: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '5',
    name: '관악산',
    difficulty: '난이도 상',
    elevation: '632m',
    imageUri: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
  },
];

type Props = {
  userName?: string;
  scrollEnabled?: boolean;
};

export default function NoRecordBottomSheet({ userName = '맹쏘', scrollEnabled = false }: Props) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = Math.round(90 * bannerWidth / 343);

  return (
    <View className="flex-1 w-full">
      {/* 섹션 1: 첫 등산 CTA */}
      <View style={{ marginHorizontal: 16, marginTop: 12 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/tracking' as never)}
        >
          <HikingStartBanner width={bannerWidth} height={bannerHeight} />
        </TouchableOpacity>
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
          {MOCK_CURATED.map((mountain) => (
            <CuratedCard key={mountain.id} mountain={mountain} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function CuratedCard({ mountain }: { mountain: CuratedMountain }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="w-[164px] h-[160px] rounded-xl overflow-hidden bg-neutral-200"
      onPress={() =>
        router.push({
          pathname: '/mountain-info',
          params: {
            name: mountain.name,
            difficulty: mountain.difficulty,
            elevation: mountain.elevation,
          },
        })
      }
    >
      {mountain.imageUri && (
        <Image
          source={{ uri: mountain.imageUri }}
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
            {mountain.difficulty}
          </Text>
          <View className="w-1 h-1 rounded-full bg-neutral-400" />
          <Text className="typo-caption-1-medium text-neutral-400">
            {mountain.elevation}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

