import { AltitudeIcon } from "@/components/icons/altitude-icon";
import { ClockIcon } from "@/components/icons/clock-icon";
import { DistanceIcon } from "@/components/icons/distance-icon";
import { NearbyMountainCourseInfo } from "@/types/api.generated";
import { Text, TouchableOpacity, View } from "react-native";
import { Course, DIFFICULTY_BG, DIFFICULTY_TEXT_COLOR } from "../constants";

// API 난이도 → 한글 라벨/스타일 매핑
const API_DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "초급",
  NORMAL: "중급",
  HARD: "고급",
};
const API_DIFFICULTY_BG: Record<string, string> = {
  EASY: "bg-green-50",
  NORMAL: "bg-yellow-50",
  HARD: "bg-red-50",
};
const API_DIFFICULTY_TEXT: Record<string, string> = {
  EASY: "text-secondary-strong",
  NORMAL: "text-yellow-600",
  HARD: "text-red-500",
};

type ApiCourseItemProps = {
  course: NearbyMountainCourseInfo;
  selected: boolean;
  onPress: () => void;
};

export function ApiCourseItem({
  course,
  selected,
  onPress,
}: ApiCourseItemProps) {
  const difficultyLabel =
    API_DIFFICULTY_LABEL[course.difficulty ?? ""] ?? course.difficulty ?? "-";
  const bg = API_DIFFICULTY_BG[course.difficulty ?? ""] ?? "bg-fill-stronger";
  const textColor =
    API_DIFFICULTY_TEXT[course.difficulty ?? ""] ?? "text-label-normal";
  const distanceKm =
    course.distance != null ? `${course.distance.toFixed(1)}km` : "-";
  const durationMin =
    course.duration != null
      ? course.duration >= 60
        ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m`
        : `${course.duration}m`
      : "-";

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`gap-3 rounded-xl border p-3 ${
        selected
          ? "border-primary-normal bg-fill-strong"
          : "border-line-subtle bg-fill-normal"
      }`}
    >
      <View className="flex-row items-center gap-2">
        <View className={`rounded px-1 py-0.5 ${bg}`}>
          <Text className={`typo-caption-1-medium ${textColor}`}>
            {difficultyLabel}
          </Text>
        </View>
        <Text className="text-label-normal typo-body-1-normal-semi-bold">
          {course.name}
        </Text>
      </View>
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <DistanceIcon />
          <Text className="text-label-subtler typo-caption-1-medium">
            거리 {distanceKm}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ClockIcon />
          <Text className="text-label-subtler typo-caption-1-medium">
            소요시간 {durationMin}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

type Props = {
  course: Course;
  selected: boolean;
  onPress: () => void;
};

export function CourseItem({ course, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`gap-3 rounded-xl border p-3 ${
        selected
          ? "border-primary-normal bg-fill-strong"
          : "border-line-subtle bg-fill-normal"
      }`}
    >
      {/* 이름 + 난이도 뱃지 */}
      <View className="flex-row items-center gap-2">
        <View
          className={`rounded px-1 py-0.5 ${DIFFICULTY_BG[course.difficulty]}`}
        >
          <Text
            className={`typo-caption-1-medium ${DIFFICULTY_TEXT_COLOR[course.difficulty]}`}
          >
            {course.difficulty}
          </Text>
        </View>
        <Text className="text-label-normal typo-body-1-normal-semi-bold">
          {course.name}
        </Text>
      </View>

      {/* 고도 + 거리 */}
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <AltitudeIcon />
          <Text className="text-label-subtler typo-caption-1-medium">
            고도 {course.altitudeNm != null ? `${course.altitudeNm}m` : "-"}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <DistanceIcon />
          <Text className="text-label-subtler typo-caption-1-medium">
            거리 {course.distanceKm}km
          </Text>
        </View>
      </View>

      {/* 정상까지 거리 + 하산까지 거리 + 소요시간 */}
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <Text className="text-label-subtler typo-caption-1-medium">
            정상까지{" "}
            {course.summitDistanceM >= 1000
              ? `${(course.summitDistanceM / 1000).toFixed(1)}km`
              : `${course.summitDistanceM}m`}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="text-label-subtler typo-caption-1-medium">
            하산까지{" "}
            {course.descentDistanceM >= 1000
              ? `${(course.descentDistanceM / 1000).toFixed(1)}km`
              : `${course.descentDistanceM}m`}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ClockIcon />
          <Text className="text-label-subtler typo-caption-1-medium">
            소요시간 {course.durationHours}h{course.durationMinutes}m
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
