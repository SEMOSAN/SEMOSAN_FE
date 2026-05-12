import { CourseBadge } from "@/features/mountains/components/course-badge";
import { type CourseDifficulty } from "@/features/mountains/constants/mountain-detail";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { CourseInfo } from "@/types/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const COURSE_DIFFICULTY_LABEL: Record<
  NonNullable<CourseInfo["difficulty"]>,
  CourseDifficulty
> = {
  EASY: "초급",
  NORMAL: "중급",
  HARD: "상급",
};

type CourseCardProps = {
  courseId?: number;
  name?: string;
  difficulty?: CourseInfo["difficulty"];
  distance?: number;
  duration?: number;
};

function CourseCard({
  courseId,
  name,
  difficulty,
  distance,
  duration,
}: CourseCardProps): React.JSX.Element {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center gap-4"
      activeOpacity={0.7}
      onPress={() => router.push(`/mountains/courses/${courseId}`)}
    >
      <View className="h-[72px] w-16 rounded-[10px] bg-fill-stronger" />
      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          {difficulty && (
            <CourseBadge difficulty={COURSE_DIFFICULTY_LABEL[difficulty]} />
          )}
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {name}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-label-subtler typo-caption-1-medium">
            {distance}km
          </Text>
          <View className="size-[2px] rounded-full bg-label-subtler" />
          <Text className="text-label-subtler typo-caption-1-medium">
            {duration}시간
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function CourseTab() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isError } = useMountainDetail(Number(id));

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  if (isError) return null;
  if (!data?.courses) return null;

  return (
    <View className="w-full gap-4 px-5">
      {data.courses.map((course) => (
        <CourseCard
          key={course.courseId}
          courseId={course.courseId}
          name={course.name}
          difficulty={course.difficulty}
          distance={course.distance}
          duration={course.duration}
        />
      ))}
    </View>
  );
}
