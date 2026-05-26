import { CourseBadge } from "@/features/mountains/components/course-badge";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { formatDuration } from "@/modules/format-duration";
import { CourseInfo } from "@/types/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

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
}: CourseCardProps) {
  const router = useRouter();

  return (
    <Pressable
      className="flex-row items-center gap-4"
      // TODO : 코스 이미지 생성되면 이미지연동 필요
      onPress={() => router.push(`/mountains/courses/${courseId}`)}
    >
      <Image
        source={require("@/assets/images/default-image.png")}
        className="h-[72px] w-16 rounded-[10px]"
        resizeMode="cover"
      />
      <View className="gap-1.5">
        <View className="flex-row items-center gap-1.5">
          {difficulty && <CourseBadge difficulty={difficulty} />}
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {name}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          {distance && (
            <>
              <Text className="text-label-subtler typo-caption-1-medium">
                {(distance / 1000).toFixed(1)}km
              </Text>
              <View className="size-[2px] rounded-full bg-label-subtler" />
            </>
          )}
          {duration && (
            <Text className="text-label-subtler typo-caption-1-medium">
              {formatDuration(duration)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
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
