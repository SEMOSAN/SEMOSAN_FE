import { AltitudeIcon } from '@/components/icons/altitude-icon';
import { AscentIcon } from '@/components/icons/ascent-icon';
import { ClockIcon } from '@/components/icons/clock-icon';
import { DescentIcon } from '@/components/icons/descent-icon';
import { DistanceIcon } from '@/components/icons/distance-icon';
import { Text, TouchableOpacity, View } from 'react-native';
import { Course, DIFFICULTY_BG, DIFFICULTY_TEXT_COLOR } from '../constants';

type Props = {
  course: Course;
  selected: boolean;
  onPress: () => void;
};

export function CourseItem({ course, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`p-3 rounded-xl border gap-3 ${
        selected ? 'border-primary-normal bg-fill-strong' : 'border-line-subtle bg-fill-normal'
      }`}
    >
      {/* 이름 + 난이도 뱃지 */}
      <View className="flex-row items-center gap-2">
        <View className={`rounded px-1 py-0.5 ${DIFFICULTY_BG[course.difficulty]}`}>
          <Text className={`typo-caption-1-medium ${DIFFICULTY_TEXT_COLOR[course.difficulty]}`}>
            {course.difficulty}
          </Text>
        </View>
        <Text className="typo-body-1-normal-semi-bold text-label-normal">{course.name}</Text>
      </View>

      {/* 고도 + 거리 */}
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <AltitudeIcon />
          <Text className="typo-caption-1-medium text-label-subtler">고도 {course.altitudeNm}Nm</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <DistanceIcon />
          <Text className="typo-caption-1-medium text-label-subtler">거리 {course.distanceKm}km</Text>
        </View>
      </View>

      {/* 오르막 + 내리막 + 소요시간 */}
      <View className="flex-row gap-4">
        <View className="flex-row items-center gap-1">
          <AscentIcon />
          <Text className="typo-caption-1-medium text-label-subtler">{course.ascentM}m</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <DescentIcon />
          <Text className="typo-caption-1-medium text-label-subtler">{course.descentM}m</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ClockIcon />
          <Text className="typo-caption-1-medium text-label-subtler">
            소요시간 {course.durationHours}h{course.durationMinutes}m
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
