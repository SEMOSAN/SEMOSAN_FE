import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { SunriseIcon } from "@/components/icons/sunrise-icon";
import { SunsetIcon } from "@/components/icons/sunset-icon";
import { AmenityTab } from "@/features/mountains-detail/components/amenity-tab";
import { CourseTab } from "@/features/mountains-detail/components/course-tab";
import { MountainTabs } from "@/features/mountains-detail/components/mountain-tabs";
import { RestaurantTab } from "@/features/mountains-detail/components/restaurant-tab";
import { ReviewTab } from "@/features/mountains-detail/components/review-tab";
import { TransportTab } from "@/features/mountains-detail/components/transport-tab";
import { MountainBookmarkButton } from "@/features/mountains/components/mountain-bookmark-button";
import { DIFFICULTY_LABEL } from "@/features/mountains/components/mountain-card";
import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { buildWeatherDays } from "@/features/mountains/modules/weather";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabKey = "코스" | "교통 정보" | "편의시설" | "주변 맛집" | "등산 후기";
const TABS: TabKey[] = [
  "코스",
  "교통 정보",
  "편의시설",
  "주변 맛집",
  "등산 후기",
];
const weatherDays = buildWeatherDays();

const SCREEN_WIDTH = Dimensions.get("window").width;

function ImageCarousel({ imageUrls }: { imageUrls: string[] }): React.JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<string>>(null);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>): void {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  }

  return (
    <View className="h-[284px] bg-fill-stronger">
      <FlatList
        ref={flatListRef}
        data={imageUrls}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: SCREEN_WIDTH, height: 284 }}
            resizeMode="cover"
          />
        )}
      />
      {imageUrls.length > 1 && (
        <View className="absolute bottom-[9px] left-0 right-0 flex-row justify-center gap-2">
          {Array.from({ length: Math.min(imageUrls.length, 3) }).map((_, i) => {
            const dotCount = Math.min(imageUrls.length, 3);
            const activeDot =
              imageUrls.length <= 2
                ? activeIndex
                : Math.round((activeIndex / (imageUrls.length - 1)) * (dotCount - 1));
            return (
              <View
                key={i}
                className={`size-[6px] rounded-full bg-white ${i === activeDot ? "" : "opacity-40"}`}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

function SunriseSunset({
  sunrise,
  sunset,
}: {
  sunrise: string;
  sunset: string;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunriseIcon />
          <Text className="text-label-subtler typo-body-3-medium">일출</Text>
        </View>
        <Text className="text-label-subtle typo-body-3-medium">{sunrise}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunsetIcon />
          <Text className="text-label-subtler typo-body-3-medium">일몰</Text>
        </View>
        <Text className="text-label-subtle typo-body-3-medium">{sunset}</Text>
      </View>
    </View>
  );
}

export default function MountainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("코스");
  const [accordionOpen, setAccordionOpen] = useState(false);

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  if (isError) return null;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-fill-normal">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
          {/* Image carousel */}
          <ImageCarousel imageUrls={data.mountain?.imageUrls ?? []} />

          {/* Content card - overlaps image with rounded top */}
          <View className="-mt-5 rounded-tl-[20px] rounded-tr-[20px] bg-fill-normal">
            {/* Mountain info */}
            <View className="gap-[7px] px-5 pt-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-end gap-3">
                  <Text className="text-label-normal typo-title-2-bold">
                    {data.mountain?.name}
                  </Text>
                  <Text className="pb-px text-label-subtler typo-body-2-normal-regular">
                    {data.mountain?.address}
                  </Text>
                </View>
                <MountainBookmarkButton mountainId={Number(id)} />
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="text-label-subtle typo-body-2-normal-medium">
                  고도 {data.mountain?.altitude}m
                </Text>
                <View className="size-[2px] rounded-full bg-label-subtler" />
                {data.mountain?.difficulty && (
                  <Text
                    className={`typo-body-2-normal-semi-bold ${data.mountain?.difficulty && COURSE_BADGE[data.mountain.difficulty].style.text}`}
                  >
                    난이도 {DIFFICULTY_LABEL[data.mountain?.difficulty]}
                  </Text>
                )}
              </View>
            </View>

            {/* Weather accordion */}
            <View className="mx-5 mt-4 gap-2 rounded-[8px] bg-[#F9FAFB] px-4 py-[10px]">
              {/* Header row — always visible, tappable */}
              <TouchableOpacity
                className="flex-row items-center justify-between"
                onPress={() => setAccordionOpen(!accordionOpen)}
                activeOpacity={0.7}
              >
                <View className="mr-3 flex-1 flex-row items-center justify-between">
                  <Text
                    className={
                      accordionOpen
                        ? "text-label-normal typo-body-3-semi-bold"
                        : "text-label-subtle typo-body-3-medium"
                    }
                  >
                    {weatherDays[0].label}
                  </Text>
                  <SunriseSunset
                    sunrise={weatherDays[0].sunrise}
                    sunset={weatherDays[0].sunset}
                  />
                </View>
                <View
                  className="w-5 items-center justify-center"
                  style={{
                    transform: [{ rotate: accordionOpen ? "180deg" : "0deg" }],
                  }}
                >
                  <CaretDownIcon color="#A4ABC0" />
                </View>
              </TouchableOpacity>

              {/* Expanded rows */}
              {accordionOpen &&
                weatherDays.slice(1).map((day) => (
                  <View
                    key={day.label}
                    className="h-5 flex-row items-center justify-between"
                  >
                    <View className="mr-3 flex-1 flex-row items-center justify-between">
                      <Text className="text-label-subtle typo-body-3-medium">
                        {day.label}
                      </Text>
                      <SunriseSunset
                        sunrise={day.sunrise}
                        sunset={day.sunset}
                      />
                    </View>
                    <View className="w-5" />
                  </View>
                ))}
            </View>

            {/* Tab section */}
            <View className="gap-6 py-6">
              <MountainTabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={(tab) => setActiveTab(tab as TabKey)}
              />

              {/* Tab content */}
              {activeTab === "코스" && <CourseTab />}
              {activeTab === "교통 정보" && <TransportTab />}
              {activeTab === "편의시설" && <AmenityTab />}
              {activeTab === "주변 맛집" && <RestaurantTab />}
              {activeTab === "등산 후기" && <ReviewTab />}
            </View>
          </View>
        </ScrollView>

        {/* Top gradient overlay (non-interactive) */}
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 108,
          }}
          pointerEvents="none"
        />

        {/* Header with back button */}
        <View
          className="absolute left-0 right-0 top-0"
          style={{ paddingTop: insets.top }}
          pointerEvents="box-none"
        >
          <View
            className="h-14 flex-row items-center px-5"
            pointerEvents="box-none"
          >
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <CaretLeftIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
