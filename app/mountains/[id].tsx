import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { SunriseIcon } from "@/components/icons/sunrise-icon";
import { SunsetIcon } from "@/components/icons/sunset-icon";
import { AmenityTab } from "@/features/mountains-detail/components/amenity-tab";
import { CourseTab } from "@/features/mountains-detail/components/course-tab";
import { RestaurantTab } from "@/features/mountains-detail/components/restaurant-tab";
import { ReviewTab } from "@/features/mountains-detail/components/review-tab";
import { TransportTab } from "@/features/mountains-detail/components/transport-tab";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_STYLE,
} from "@/features/mountains/components/mountain-card";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { buildWeatherDays } from "@/features/mountains/modules/weather";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabKey = "코스" | "교통" | "편의" | "맛집" | "리뷰";
const TABS: TabKey[] = ["코스", "교통", "편의", "맛집", "리뷰"];

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
  const weatherDays = buildWeatherDays();

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
          <View className="h-[284px] bg-fill-stronger">
            <Image
              source={{ uri: data.mountain?.imageUrl }}
              className="absolute inset-0"
              resizeMode="cover"
            />
            <View className="absolute bottom-[9px] left-0 right-0 flex-row justify-center gap-2">
              <View className="size-[6px] rounded-full bg-white" />
              <View className="size-[6px] rounded-full bg-white opacity-40" />
              <View className="size-[6px] rounded-full bg-white opacity-40" />
            </View>
          </View>

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
                <TouchableOpacity hitSlop={8}>
                  <HeartIcon />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="text-label-subtle typo-body-2-normal-medium">
                  고도 {data.mountain?.altitude}m
                </Text>
                <View className="size-[2px] rounded-full bg-label-subtler" />
                {data.mountain?.difficulty && (
                  <Text
                    className={`typo-body-2-normal-semi-bold ${data.mountain?.difficulty && DIFFICULTY_STYLE[data.mountain.difficulty]}`}
                  >
                    난이도 {DIFFICULTY_LABEL[data.mountain?.difficulty]}
                  </Text>
                )}
              </View>
            </View>

            {/* Weather accordion */}
            <View className="mt-4 gap-[10px] bg-fill-strong px-6 py-[10px]">
              {/* Header row — always visible, tappable */}
              <TouchableOpacity
                className="h-5 flex-row items-center"
                onPress={() => setAccordionOpen(!accordionOpen)}
                activeOpacity={0.7}
              >
                <View className="mr-3 flex-1 flex-row items-center justify-between">
                  <Text className="text-label-normal typo-body-3-semi-bold">
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
                  <CaretDownIcon color="#73798C" />
                </View>
              </TouchableOpacity>

              {/* Expanded rows — 내일 ~ 6일 후 */}
              {accordionOpen &&
                weatherDays.slice(1).map((day) => (
                  <View key={day.label} className="h-5 flex-row items-center">
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
              {/* Tab toggle bar */}
              <View className="mx-[20.5px] flex-row gap-1 rounded-[10px] bg-fill-stronger p-1">
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`flex-1 items-center justify-center rounded-[6px] px-[10px] py-[6px] ${
                      activeTab === tab ? "bg-fill-normal" : ""
                    }`}
                  >
                    <Text
                      className={`typo-label-medium ${
                        activeTab === tab
                          ? "text-label-normal"
                          : "text-label-subtler"
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tab content */}
              {activeTab === "코스" && <CourseTab />}
              {activeTab === "교통" && <TransportTab />}
              {activeTab === "편의" && <AmenityTab />}
              {activeTab === "맛집" && <RestaurantTab />}
              {activeTab === "리뷰" && <ReviewTab />}
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
