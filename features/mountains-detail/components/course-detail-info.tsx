import { HeartIcon } from "@/components/icons/heart-icon";
import { CourseBadge } from "@/features/mountains/components/course-badge";
import { formatDuration } from "@/modules/format-duration";
import { CourseDetailResponse } from "@/types/api.generated";
import { Pressable, Text, View } from "react-native";

type CourseDetailInfoProps = {
  course: CourseDetailResponse;
};

export function CourseDetailInfo({ course }: CourseDetailInfoProps) {
  const statRows = [
    [
      {
        label: "거리",
        value: course.distance
          ? `${(course.distance / 1000).toFixed(1)}km`
          : "-",
      },
      { label: "난이도", value: course.difficulty ?? "-" },
      {
        label: "소요시간",
        value: course.duration ? formatDuration(course.duration) : "-",
      },
    ],
    [
      { label: "고도", value: "-" },
      { label: "오르막길", value: "-" },
      { label: "내리막길", value: "-" },
    ],
  ];

  return (
    <>
      {/* Map placeholder */}
      <View className="mx-5 h-[200px] overflow-hidden rounded-[20px] bg-fill-stronger" />

      {/* Course info */}
      <View className="gap-[10px] px-5 pt-5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-[10px]">
            {course.difficulty && (
              <CourseBadge difficulty={course.difficulty} />
            )}
            <Text className="text-label-normal typo-heading-1-semi-bold">
              {course.name}
            </Text>
          </View>
          <Pressable hitSlop={8}>
            <HeartIcon />
          </Pressable>
        </View>

        {/* Start / End */}
        <View className="gap-[4px]">
          <View className="flex-row items-center gap-[8px]">
            <View
              className="size-[10px] rounded-full"
              style={{ backgroundColor: "#507EF4" }}
            />
            <Text className="text-label-subtle typo-body-2-normal-semi-bold">
              출발
            </Text>
            <Text className="text-label-subtler typo-body-2-normal-regular">
              {course.startName ?? "-"}
            </Text>
          </View>
          <View className="flex-row items-center gap-[8px]">
            <View
              className="size-[10px] rounded-full"
              style={{ backgroundColor: "#FF5249" }}
            />
            <Text className="text-label-subtle typo-body-2-normal-semi-bold">
              도착
            </Text>
            <Text className="text-label-subtler typo-body-2-normal-regular">
              {course.endName ?? "-"}
            </Text>
          </View>
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
    </>
  );
}
