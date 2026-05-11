import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { RouteIcon } from "@/components/icons/route-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { CourseBadge } from "@/features/mountains/components/course-badge";
import {
  MOCK_COURSES,
  MOCK_REVIEWS,
} from "@/features/mountains/constants/mountain-detail";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CourseDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = MOCK_COURSES.find((c) => String(c.id) === id);

  const statRows = course
    ? [
        [
          { label: "거리", value: `${course.distanceKm}km` },
          { label: "난이도", value: course.difficulty },
          { label: "소요시간", value: `${course.durationHours}시간` },
        ],
        [
          { label: "고도", value: "-" },
          { label: "오르막길", value: "-" },
          { label: "내리막길", value: "-" },
        ],
      ]
    : [];

  if (!course) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center bg-fill-normal">
          <Text className="text-label-subtle typo-body-2-normal-regular">
            코스를 찾을 수 없습니다.
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 bg-fill-normal">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        >
          {/* Header spacer */}
          <View style={{ height: insets.top + 56 + 8 }} />

          {/* Map */}
          <View className="mx-5 h-[200px] overflow-hidden rounded-[20px] bg-fill-stronger">
            <Image
              source={course.imageSource ?? { uri: course.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="stretch"
            />
          </View>

          {/* Course info */}
          <View className="gap-[10px] px-5 pt-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-[10px]">
                <CourseBadge difficulty={course.difficulty} />
                <Text className="text-label-normal typo-heading-1-semi-bold">
                  {course.title}
                </Text>
              </View>
              <TouchableOpacity hitSlop={8}>
                <HeartIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats grid */}
          <View className="mt-6 gap-[6px]">
            {statRows.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row justify-center gap-1">
                {row.map(({ label, value }) => (
                  <View
                    key={label}
                    className="w-[109px] items-center justify-center gap-[6px] py-2"
                  >
                    <Text className="text-label-subtler typo-body-3-medium">
                      {label}
                    </Text>
                    <Text className="text-label-normal typo-heading-1-semi-bold">
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Divider */}
          <View className="mt-6 h-[6px] bg-fill-strong" />

          {/* Reviews */}
          <View className="gap-4 px-5 py-6">
            <View className="flex-row items-center gap-2">
              <Text className="text-label-normal typo-headline-1-semi-bold">
                커뮤니티 리뷰
              </Text>
              <Text className="text-neutral-300 typo-headline-1-semi-bold">
                54
              </Text>
            </View>

            <View className="gap-4">
              {MOCK_REVIEWS.map((review, idx) => (
                <View
                  key={review.id}
                  className={`gap-3 px-1 pb-4 pt-1 ${
                    idx < MOCK_REVIEWS.length - 1
                      ? "border-b border-line-subtle"
                      : ""
                  }`}
                >
                  <View className="flex-row items-start gap-4">
                    <View className="size-[92px] rounded-[10px] bg-fill-stronger" />
                    <View className="flex-1 gap-1.5">
                      <View className="flex-row items-center gap-1.5">
                        <View className="items-center justify-center rounded-full bg-fill-strongest p-[3px]">
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
                </View>
              ))}
            </View>

            <TouchableOpacity className="h-[38px] items-center justify-center rounded-[8px] bg-fill-stronger">
              <Text className="text-label-subtle typo-label-medium">
                더보기
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Header overlay */}
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

        {/* CTA floating button */}
        <View
          className="absolute left-0 right-0 items-center"
          style={{ bottom: insets.bottom + 8 }}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/tracking?collapse=true")}
            className="flex-row items-center gap-2 rounded-full bg-primary-normal px-5 py-3"
          >
            <RouteIcon />
            <Text className="text-label-normal-inverse typo-label-large">
              코스 따라가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
