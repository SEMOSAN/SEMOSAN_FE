import { HikingStartBanner } from "@/components/icons/hiking-start-banner";
import { useMountainRecommendations } from "@/features/mountains/hooks/use-mountain-recommendations";
import { MountainRecommendationResponse } from "@/types/api.generated";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { LoadingSpinner } from "./loading-spinner";

type Props = {
  userName?: string;
  scrollEnabled?: boolean;
  lat?: number;
  lng?: number;
};

export default function NoRecordBottomSheet({
  userName = "맹쏘",
  scrollEnabled = false,
  lat,
  lng,
}: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const bannerWidth = screenWidth - 32;
  const bannerHeight = Math.round((90 * bannerWidth) / 343);
  const { data, isPending, isError } = useMountainRecommendations(lat, lng);

  if (isPending) return <LoadingSpinner fullScreen />;
  if (isError) return null;

  return (
    <View className="w-full flex-1">
      {/* 섹션 1: 첫 등산 CTA */}
      <View style={{ marginHorizontal: 16, marginTop: 12 }}>
        <View>
          <HikingStartBanner width={bannerWidth} height={bannerHeight} />
        </View>
      </View>

      {/* 섹션 2: 레벨 맞는 산 추천 */}
      <View className="pt-4">
        <View className="mb-3 flex-row items-center gap-0.5 px-4">
          <Text className="text-secondary-normal typo-headline-1-semi-bold">
            {userName}
          </Text>
          <Text className="text-label-normal typo-headline-1-semi-bold">
            님의 레벨에 맞는 산
          </Text>
          {/* TODO : 인포 클릭 구현되면 추가 */}
          {/* <InfoIcon size={16.25} /> */}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-2"
          scrollEnabled={scrollEnabled}
        >
          {data.map((mountain) => (
            <CuratedCard key={mountain.mountainId} mountain={mountain} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function CuratedCard({
  mountain,
}: {
  mountain: MountainRecommendationResponse;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="h-[164px] w-[164px] overflow-hidden rounded-xl bg-neutral-200"
      onPress={() =>
        router.push({
          pathname: "/mountains/[id]",
          params: {
            id: mountain.mountainId ?? 0,
            name: mountain.name,
            difficulty: mountain.difficultyLabel,
            ...(mountain.mountainHeightM !== undefined && {
              elevation: `${Math.round(mountain.mountainHeightM)}m`,
            }),
          },
        })
      }
    >
      {mountain.imageUrl && (
        <Image
          source={{ uri: mountain.imageUrl }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={["rgba(0,0,0,0.09)", "rgba(0,0,0,0.90)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <View className="flex-1 justify-end gap-1 p-4">
        <Text
          className="text-common-100 typo-heading-1-semi-bold"
          numberOfLines={1}
        >
          {mountain.name}
        </Text>
        <View className="flex-row items-center gap-1.5">
          {mountain.difficultyLabel && (
            <Text className="text-neutral-400 typo-caption-1-medium">
              난이도 {mountain.difficultyLabel}
            </Text>
          )}
          {mountain.difficultyLabel &&
            mountain.mountainHeightM !== undefined && (
              <View className="h-1 w-1 rounded-full bg-neutral-400" />
            )}
          {mountain.mountainHeightM !== undefined && (
            <Text className="text-neutral-400 typo-caption-1-medium">
              {Math.round(mountain.mountainHeightM)}m
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
