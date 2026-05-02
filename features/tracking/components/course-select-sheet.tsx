import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Course, MOCK_COURSES } from '../constants';
import { CourseItem } from './course-item';

type Props = {
  selectedCourseId: string | null;
  onSelectCourse: (id: string) => void;
  onFreeRecord: () => void;
  onStartCountdown: () => void;
};

export function CourseSelectSheet({
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
          관악산 등산을 기록할까요?
        </Text>
        <Text className="typo-body-2-normal-regular text-label-subtler">
          코스를 선택해서 시작하거나 자유 기록을 시작하세요.
        </Text>
      </View>

      {/* 코스 리스트 */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 gap-3 pb-2"
        showsVerticalScrollIndicator={false}
      >
        {MOCK_COURSES.map((course: Course) => (
          <CourseItem
            key={course.id}
            course={course}
            selected={selectedCourseId === course.id}
            onPress={() => onSelectCourse(course.id)}
          />
        ))}
      </ScrollView>

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
        >
          <Text className="typo-label-large text-common-100">코스 따라가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
