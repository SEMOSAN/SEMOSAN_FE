import {
  NearbyMountainCourseInfo,
  NearbyMountainInfo,
} from "@/types/api.generated";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ApiCourseItem } from "./course-item";

type Props = {
  mountain?: NearbyMountainInfo;
  courses?: NearbyMountainCourseInfo[];
  isLoading?: boolean;
  selectedCourseId: number | null;
  onSelectCourse: (id: number) => void;
  onFreeRecord: () => void;
  onStartCountdown: () => void;
};

export function CourseSelectSheet({
  mountain,
  courses,
  isLoading,
  selectedCourseId,
  onSelectCourse,
  onFreeRecord,
  onStartCountdown,
}: Props) {
  return (
    <View
      className="w-full overflow-hidden bg-fill-normal"
      style={{ height: 448, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 드래그 핸들 */}
      <View className="items-center pb-2 pt-3">
        <View className="h-1 w-10 rounded-full bg-fill-neutral" />
      </View>

      {/* 타이틀 */}
      <View className="gap-1 px-4 pb-4 pt-1">
        <Text className="text-label-normal typo-headline-1-semi-bold">
          {mountain?.name
            ? `${mountain.name} 등산을 기록할까요?`
            : "등산을 기록할까요?"}
        </Text>
        <Text className="text-label-subtler typo-body-2-normal-regular">
          코스를 선택해서 시작하거나 자유 기록을 시작하세요.
        </Text>
      </View>

      {/* 코스 리스트 */}
      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-4 gap-3 pb-2"
          showsVerticalScrollIndicator={false}
        >
          {(courses ?? []).map((course) => (
            <ApiCourseItem
              key={course.courseId}
              course={course}
              selected={selectedCourseId === course.courseId}
              onPress={() =>
                course.courseId != null && onSelectCourse(course.courseId)
              }
            />
          ))}
          {!courses?.length && (
            <Text className="py-4 text-center text-label-subtler typo-body-2-normal-regular">
              등록된 코스가 없어요
            </Text>
          )}
        </ScrollView>
      )}

      {/* 하단 버튼 */}
      <View className="flex-row gap-2 px-4 pb-4 pt-5">
        <TouchableOpacity
          className="h-12 flex-1 items-center justify-center rounded-[10px] bg-fill-stronger px-5"
          onPress={onFreeRecord}
        >
          <Text className="text-label-subtle typo-label-large">
            자유 기록하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="h-12 flex-1 items-center justify-center rounded-[10px] bg-primary-normal px-5"
          onPress={onStartCountdown}
          disabled={selectedCourseId === null}
        >
          <Text className="text-common-100 typo-label-large">
            코스 따라가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
