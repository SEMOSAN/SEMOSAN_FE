import { NearbyMountainCourse, NearbyMountainInfo } from '@/types/api.generated';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ApiCourseItem } from './course-item';

type Props = {
  mountain?: NearbyMountainInfo;
  courses?: NearbyMountainCourse[];
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
      className="w-full bg-fill-normal overflow-hidden"
      style={{ height: 448, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      {/* 드래그 핸들 */}
      <View className="items-center pt-3 pb-2">
        <View className="w-10 h-1 rounded-full bg-fill-neutral" />
      </View>

      {/* 타이틀 */}
      <View className="px-4 pt-1 pb-4 gap-1">
        <Text className="typo-headline-1-semi-bold text-label-normal">
          {mountain?.name ? `${mountain.name} 등산을 기록할까요?` : '등산을 기록할까요?'}
        </Text>
        <Text className="typo-body-2-normal-regular text-label-subtler">
          코스를 선택해서 시작하거나 자유 기록을 시작하세요.
        </Text>
      </View>

      {/* 코스 리스트 */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
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
              onPress={() => course.courseId != null && onSelectCourse(course.courseId)}
            />
          ))}
          {!courses?.length && (
            <Text className="typo-body-2-normal-regular text-label-subtler text-center py-4">
              등록된 코스가 없어요
            </Text>
          )}
        </ScrollView>
      )}

      {/* 하단 버튼 */}
      <View className="flex-row gap-2 px-4 pt-5 pb-4">
        <TouchableOpacity
          className="flex-1 h-12 bg-fill-stronger rounded-[10px] px-5 items-center justify-center"
          onPress={onFreeRecord}
        >
          <Text className="typo-label-large text-label-subtle">자유 기록하기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 h-12 bg-primary-normal rounded-[10px] px-5 items-center justify-center"
          onPress={onStartCountdown}
          disabled={selectedCourseId === null}
        >
          <Text className="typo-label-large text-common-100">코스 따라가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
