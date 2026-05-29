import { ArrowsHorizontalIcon } from "@/components/icons/arrows-horizontal-icon";
import { CourseBadge } from "@/features/mountains/components/course-badge";
import { useMountainDetail } from "@/features/mountains/hooks/use-mountain-detail";
import { formatDuration } from "@/modules/format-duration";
import { MountainDetailCourseInfo } from "@/types/api.generated";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Pressable, Text, View } from "react-native";

type CourseCardProps = {
  courseId?: number;
  mountainId?: number;
  name?: string;
  difficulty?: MountainDetailCourseInfo["difficulty"];
  distance?: number;
  duration?: number;
  startName?: string;
  endName?: string;
};

function CourseCard({
  courseId,
  mountainId,
  name,
  difficulty,
  distance,
  duration,
  startName,
  endName,
}: CourseCardProps) {
  const router = useRouter();

  return (
    <Pressable
      className={`border-b border-line-subtle pb-[18px]`}
      // TODO : 코스 이미지 생성되면 이미지연동 필요
      onPress={() =>
        router.push(`/mountains/courses/${courseId}?mountainId=${mountainId}`)
      }
    >
      {/* TODO : 리스트에도 코스컴포넌트 띄워주기에 메모리를 너무 잡아먹으므로 일단 보류 */}
      {/* <Image
        source={require("@/assets/images/default-image.png")}
        className="h-[72px] w-16 rounded-[10px]"
        resizeMode="cover"
      /> */}
      <View className="gap-[7px] px-1">
        <View className="flex-row items-center gap-1.5">
          {difficulty && <CourseBadge difficulty={difficulty} />}
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {name}
          </Text>
        </View>
        {(startName || endName) && (
          <View className="flex-row items-center gap-1.5">
            <Text className="text-label-subtle typo-caption-1-medium">
              {startName}
            </Text>
            <ArrowsHorizontalIcon size={14} />
            <Text className="text-label-subtle typo-caption-1-medium">
              {endName}
            </Text>
          </View>
        )}
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

  if (isPending) return <LoadingSpinner fullScreen />;
  if (isError) return null;
  if (!data?.courses) return null;

  return (
    <View className="w-full gap-4 px-5">
      {data.courses.map((course) => (
        <CourseCard
          key={course.courseId}
          courseId={course.courseId}
          mountainId={Number(id)}
          name={course.name}
          difficulty={course.difficulty}
          distance={course.distance}
          duration={course.duration}
          startName={course.startName}
          endName={course.endName}
        />
      ))}
    </View>
  );
}
