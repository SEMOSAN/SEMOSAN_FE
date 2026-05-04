import { BusIcon } from "@/components/icons/bus-icon";
import { CarIcon } from "@/components/icons/car-icon";
import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { InfoCenterIcon } from "@/components/icons/info-center-icon";
import { MagicWandIcon } from "@/components/icons/magic-wand-icon";
import { MegaphoneIcon } from "@/components/icons/megaphone-icon";
import { ParkingIcon } from "@/components/icons/parking-icon";
import { ShelterIcon } from "@/components/icons/shelter-icon";
import { StoreIcon } from "@/components/icons/store-icon";
import { SubwayIcon } from "@/components/icons/subway-icon";
import { SunriseIcon } from "@/components/icons/sunrise-icon";
import { SunsetIcon } from "@/components/icons/sunset-icon";
import { ToiletIcon } from "@/components/icons/toilet-icon";
import { UserIcon } from "@/components/icons/user-icon";
import {
  DIFFICULTY_STYLE,
  MOCK_MOUNTAINS,
} from "@/features/mountains/components/mountain-card";
import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import {
  MOCK_COURSES,
  MOCK_REVIEWS,
  RESTAURANT_SECTIONS,
  type Course,
  type CourseDifficulty,
} from "@/features/mountains/constants/mountain-detail";
import { buildWeatherDays } from "@/features/mountains/modules/weather";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

function CourseBadge({ difficulty }: { difficulty: CourseDifficulty }) {
  const { bg, text } = COURSE_BADGE[difficulty];
  return (
    <View className={`items-center justify-center rounded-[4px] px-1 ${bg}`}>
      <Text className={`typo-body-2-normal-medium ${text}`}>{difficulty}</Text>
    </View>
  );
}

function CourseCard({ course }: { course: Course }) {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="flex-row items-center gap-4"
      activeOpacity={0.7}
      onPress={() => router.push(`/mountains/courses/${course.id}`)}
    >
      <View className="h-[72px] w-16 rounded-[10px] bg-fill-stronger" />
      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          <CourseBadge difficulty={course.difficulty} />
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {course.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-label-subtler typo-caption-1-medium">
            {course.distanceKm}km
          </Text>
          <View className="size-[2px] rounded-full bg-label-subtler" />
          <Text className="text-label-subtler typo-caption-1-medium">
            {course.durationHours}시간
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── 교통 ──────────────────────────────────────────────
type TransportItem = {
  id: number;
  title: string;
  description: string;
  icon?: React.JSX.Element;
};
type TransportSection = {
  heading: string;
  items: TransportItem[];
};
const TRANSPORT_SECTIONS: TransportSection[] = [
  {
    heading: "대중교통",
    items: [
      {
        id: 1,
        title: "지하철",
        description: "2호선 서울대입구역 하차 후 5511번 버스 탑승",
        icon: <SubwayIcon size={16} color="#5C6170" />,
      },
      {
        id: 2,
        title: "버스",
        description: "5511, 5513번 버스 이용 (관악산 입구 하차)",
        icon: <BusIcon size={16} color="#5C6170" />,
      },
    ],
  },
  {
    heading: "주차장",
    items: [
      {
        id: 1,
        title: "서울대 정문",
        description: "서울대학교 정문 주차장 (유료, 30분 1,000원)",
        icon: <CarIcon size={16} color="#5C6170" />,
      },
      {
        id: 2,
        title: "과천 향교 방면",
        description: "과천 방면 공영주차장 (무료, 100대 수용)",
        icon: <CarIcon size={16} color="#5C6170" />,
      },
    ],
  },
];

// ── 편의시설 ────────────────────────────────────────────
type Facility = "화장실" | "안내소" | "쉼터" | "주차장" | "매점";
type AmenityArea = {
  name: string;
  facilities: Facility[];
};
const AMENITY_AREAS: AmenityArea[] = [
  {
    name: "서울대 입구",
    facilities: ["화장실", "안내소", "쉼터", "주차장", "매점"],
  },
  { name: "신림 방향", facilities: ["화장실", "쉼터", "매점"] },
  { name: "과천 방향", facilities: ["화장실", "안내소", "주차장"] },
];

// ── 맛집 / 리뷰 ── constants/mountain-detail.ts 참고

// ── 탭 컴포넌트 ──────────────────────────────────────────
function TransportTab() {
  return (
    <View className="w-full gap-10 px-6">
      {TRANSPORT_SECTIONS.map((section) => (
        <View key={section.heading} className="gap-4">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            {section.heading}
          </Text>
          <View className="gap-4">
            {section.items.map((item) => (
              <View key={item.id} className="flex-row items-start gap-3">
                <View className="items-center justify-center rounded-full bg-fill-stronger p-1">
                  {item.icon ?? (
                    <View className="size-5 rounded-[4px] bg-fill-stronger" />
                  )}
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-label-normal typo-body-1-normal-semi-bold">
                    {item.title}
                  </Text>
                  <Text className="text-label-subtle typo-body-2-reading-regular">
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const FACILITY_ICON: Record<Facility, React.JSX.Element> = {
  화장실: <ToiletIcon />,
  안내소: <InfoCenterIcon />,
  쉼터: <ShelterIcon />,
  주차장: <ParkingIcon />,
  매점: <StoreIcon />,
};

function AmenityTab() {
  return (
    <View className="w-full px-5">
      <Text className="mb-4 text-label-normal typo-headline-1-semi-bold">
        주요 편의시설
      </Text>
      <View className="gap-8">
        {AMENITY_AREAS.map((area) => (
          <View key={area.name} className="gap-3">
            <Text className="text-label-subtle typo-body-1-normal-semi-bold">
              {area.name}
            </Text>
            <View className="flex-row flex-wrap">
              {area.facilities.map((facility) => (
                <View key={facility} className="items-center gap-1.5 p-4">
                  {FACILITY_ICON[facility]}
                  <Text className="text-center text-label-subtle typo-body-3-regular">
                    {facility}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function RestaurantTab() {
  return (
    <View className="w-full gap-8">
      {RESTAURANT_SECTIONS.map((section) => (
        <View key={section.title} className="gap-4">
          <Text className="px-5 text-label-normal typo-headline-1-semi-bold">
            {section.title}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
          >
            {section.items.map((item) => (
              <View key={item.id} className="gap-2">
                <View className="h-[116px] w-[188px] rounded-[10px] bg-fill-stronger" />
                <View className="gap-0.5">
                  <Text className="text-label-normal typo-body-1-normal-semi-bold">
                    {item.name}
                  </Text>
                  <Text className="text-label-subtler typo-caption-1-medium">
                    {item.category}
                  </Text>
                </View>
              </View>
            ))}
            <View className="h-[116px] w-[188px] items-center justify-center gap-1 rounded-[10px] bg-fill-stronger">
              <Text className="text-center text-label-subtle typo-body-2-normal-semi-bold">
                {section.moreLabel}
              </Text>
              <Text className="text-label-subtler typo-body-2-normal-regular">
                {"더보기 >"}
              </Text>
            </View>
          </ScrollView>
        </View>
      ))}
    </View>
  );
}

function ReviewTab() {
  return (
    <View className="w-full gap-8 px-5">
      {/* 요약 카드 */}
      <View className="gap-3">
        <View className="gap-2 rounded-[12px] bg-blue-25 px-5 py-[18px]">
          <View className="flex-row items-center gap-2">
            <MagicWandIcon />
            <Text className="text-label-normal typo-body-1-normal-semi-bold">
              한줄 경험 요약
            </Text>
          </View>
          <Text className="text-label-subtle typo-body-2-normal-regular">
            생각보다 더 힘들고, 그만큼 정상에서의 보람이 큰 산
          </Text>
        </View>
        <View className="gap-2 rounded-[12px] bg-red-25 px-5 py-[18px]">
          <View className="flex-row items-center gap-2">
            <MegaphoneIcon />
            <Text className="text-label-normal typo-body-1-normal-semi-bold">
              가기 전에 꼭 알아야 할 한 가지
            </Text>
          </View>
          <Text className="text-label-subtle typo-body-2-normal-regular">
            중간에 화장실 거의 없음, 초입에서 미리 다녀오세요
          </Text>
        </View>
      </View>

      {/* 커뮤니티 리뷰 */}
      <View className="gap-4">
        <View className="flex-row items-center gap-2">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            커뮤니티 리뷰
          </Text>
          <Text className="text-neutral-300 typo-headline-1-semi-bold">54</Text>
        </View>

        <View className="gap-4">
          {MOCK_REVIEWS.map((review) => (
            <View key={review.id} className="gap-3 px-1 pb-4 pt-1">
              <View className="flex-row gap-4">
                <View className="size-[92px] rounded-[10px] bg-fill-stronger" />
                <View className="flex-1 gap-1.5">
                  <View className="flex-row items-center gap-1.5">
                    <View
                      className="items-center justify-center rounded-full p-[3px]"
                      style={{ backgroundColor: "#A4ABC0" }}
                    >
                      <UserIcon />
                    </View>
                    <Text className="text-label-normal typo-body-2-normal-semi-bold">
                      {review.userName}
                    </Text>
                  </View>
                  <Text
                    className="text-label-normal typo-body-2-normal-regular"
                    numberOfLines={3}
                  >
                    {review.text}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <CourseBadge difficulty={review.difficulty} />
                <Text className="text-label-normal typo-body-2-normal-medium">
                  {review.courseName}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity className="h-[38px] items-center justify-center rounded-[8px] bg-fill-stronger">
          <Text className="text-label-subtle typo-label-medium">더보기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MountainDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabKey>("코스");
  const [accordionOpen, setAccordionOpen] = useState(false);
  const weatherDays = buildWeatherDays();

  const mountain =
    MOCK_MOUNTAINS.find((m) => m.id === Number(id)) ?? MOCK_MOUNTAINS[0]; // TODO : 예외처리

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
                  <Text className="text-label-normal typo-title-2-bold">
                    {mountain.name}
                  </Text>
                  <Text className="pb-px text-label-subtler typo-body-2-normal-regular">
                    {mountain.location}
                  </Text>
                </View>
                <TouchableOpacity hitSlop={8}>
                  <HeartIcon />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="text-label-subtle typo-body-2-normal-medium">
                  고도 {mountain.altitude}m
                </Text>
                <View className="size-[2px] rounded-full bg-label-subtler" />
                <Text
                  className={`typo-body-2-normal-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}
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
              {activeTab === "코스" && (
                <View className="w-full gap-4 px-5">
                  {MOCK_COURSES.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </View>
              )}
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
