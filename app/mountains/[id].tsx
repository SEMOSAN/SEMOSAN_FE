import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { SunriseIcon } from "@/components/icons/sunrise-icon";
import { SunsetIcon } from "@/components/icons/sunset-icon";
import {
  MOCK_MOUNTAINS,
  type Difficulty,
} from "@/features/mountains/components/mountain-card";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

type CourseDifficulty = "초급" | "중급" | "상급";

type Course = {
  id: number;
  title: string;
  difficulty: CourseDifficulty;
  distanceKm: number;
  durationHours: number;
};

const MOCK_COURSES: Course[] = [
  { id: 1, title: "관악산 코스 1", difficulty: "초급", distanceKm: 10, durationHours: 3 },
  { id: 2, title: "관악산 코스 2", difficulty: "중급", distanceKm: 10, durationHours: 3 },
  { id: 3, title: "관악산 코스 3", difficulty: "상급", distanceKm: 10, durationHours: 3 },
  { id: 4, title: "관악산 코스 4", difficulty: "상급", distanceKm: 10, durationHours: 3 },
  { id: 5, title: "관악산 코스 5", difficulty: "초급", distanceKm: 10, durationHours: 3 },
];

const COURSE_BADGE: Record<CourseDifficulty, { bg: string; text: string }> = {
  초급: { bg: "bg-green-50", text: "text-green-500" },
  중급: { bg: "bg-blue-50", text: "text-blue-500" },
  상급: { bg: "bg-red-50", text: "text-red-500" },
};

const DIFFICULTY_TEXT: Record<Difficulty, string> = {
  하: "text-green-500",
  중: "text-blue-500",
  상: "text-red-500",
};

type TabKey = "코스" | "교통" | "편의" | "맛집" | "리뷰";
const TABS: TabKey[] = ["코스", "교통", "편의", "맛집", "리뷰"];

type WeatherDay = {
  label: string;
  sunrise: string;
  sunset: string;
};

function buildWeatherDays(): WeatherDay[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    let label: string;
    if (i === 0) {
      label = "오늘";
    } else if (i === 1) {
      label = "내일";
    } else {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      label = `${d.getMonth() + 1}/${d.getDate()}`;
    }
    return { label, sunrise: "05:01", sunset: "19:01" };
  });
}

function HeartIcon(): React.JSX.Element {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="#1A1B1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SunriseSunset({ sunrise, sunset }: { sunrise: string; sunset: string }): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-3">
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunriseIcon />
          <Text className="typo-body-3-medium text-label-subtler">일출</Text>
        </View>
        <Text className="typo-body-3-medium text-label-subtle">{sunrise}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="flex-row items-center gap-1">
          <SunsetIcon />
          <Text className="typo-body-3-medium text-label-subtler">일몰</Text>
        </View>
        <Text className="typo-body-3-medium text-label-subtle">{sunset}</Text>
      </View>
    </View>
  );
}

function CourseBadge({ difficulty }: { difficulty: CourseDifficulty }): React.JSX.Element {
  const { bg, text } = COURSE_BADGE[difficulty];
  return (
    <View className={`items-center justify-center rounded-[4px] px-1 ${bg}`}>
      <Text className={`typo-body-2-normal-medium ${text}`}>{difficulty}</Text>
    </View>
  );
}

function CourseCard({ course }: { course: Course }): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-[72px] w-16 rounded-[10px] bg-fill-stronger" />
      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <CourseBadge difficulty={course.difficulty} />
          <Text className="typo-body-1-normal-semi-bold text-label-normal">
            {course.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="typo-caption-1-medium text-label-subtler">
            {course.distanceKm}km
          </Text>
          <View className="size-[2px] rounded-full bg-label-subtler" />
          <Text className="typo-caption-1-medium text-label-subtler">
            {course.durationHours}시간
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function MountainDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("코스");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const weatherDays = buildWeatherDays();

  const mountain =
    MOCK_MOUNTAINS.find((m) => m.id === Number(id)) ?? MOCK_MOUNTAINS[0];

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
                  <Text className="typo-title-2-bold text-label-normal">
                    {mountain.name}
                  </Text>
                  <Text className="pb-px typo-body-2-normal-regular text-label-subtler">
                    {mountain.location}
                  </Text>
                </View>
                <TouchableOpacity hitSlop={8}>
                  <HeartIcon />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="typo-body-2-normal-medium text-label-subtle">
                  고도 {mountain.altitude}m
                </Text>
                <View className="size-[2px] rounded-full bg-label-subtler" />
                <Text
                  className={`typo-body-2-normal-semi-bold ${DIFFICULTY_TEXT[mountain.difficulty]}`}
                >
                  난이도 {mountain.difficulty}
                </Text>
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
                  <Text className="typo-body-3-semi-bold text-label-normal">
                    {weatherDays[0].label}
                  </Text>
                  <SunriseSunset
                    sunrise={weatherDays[0].sunrise}
                    sunset={weatherDays[0].sunset}
                  />
                </View>
                <View className="w-5 items-center justify-center">
                  <CaretDownIcon color="#73798C" />
                </View>
              </TouchableOpacity>

              {/* Expanded rows — 내일 ~ 6일 후 */}
              {accordionOpen &&
                weatherDays.slice(1).map((day) => (
                  <View key={day.label} className="h-5 flex-row items-center">
                    <View className="mr-3 flex-1 flex-row items-center justify-between">
                      <Text className="typo-body-3-medium text-label-subtle">
                        {day.label}
                      </Text>
                      <SunriseSunset sunrise={day.sunrise} sunset={day.sunset} />
                    </View>
                    <View className="w-5" />
                  </View>
                ))}
            </View>

            {/* Tab section */}
            <View className="items-center gap-6 py-6">
              {/* Tab toggle bar */}
              <View className="flex-row gap-1 rounded-[10px] bg-fill-stronger p-1">
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`w-[62px] items-center justify-center rounded-[6px] px-[10px] py-[6px] ${
                      activeTab === tab ? "bg-fill-normal" : ""
                    }`}
                  >
                    <Text
                      className={`typo-label-medium ${
                        activeTab === tab ? "text-label-normal" : "text-label-subtler"
                      }`}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Tab content */}
              {activeTab === "코스" && (
                <View className="w-full gap-4 px-5">
                  {MOCK_COURSES.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Top gradient overlay (non-interactive) */}
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "transparent"]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 108 }}
          pointerEvents="none"
        />

        {/* Header with back button */}
        <View
          className="absolute left-0 right-0 top-0"
          style={{ paddingTop: insets.top }}
          pointerEvents="box-none"
        >
          <View className="h-14 flex-row items-center px-5" pointerEvents="box-none">
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <CaretLeftIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
