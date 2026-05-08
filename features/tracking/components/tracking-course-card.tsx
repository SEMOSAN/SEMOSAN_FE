import { AltitudeIcon } from '@/components/icons/altitude-icon';
import { AscentIcon } from '@/components/icons/ascent-icon';
import { ChevronDownIcon } from '@/components/icons/chevron-down-icon';
import { ClockIcon } from '@/components/icons/clock-icon';
import { DescentIcon } from '@/components/icons/descent-icon';
import { DistanceIcon } from '@/components/icons/distance-icon';
import { useState } from 'react';
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { CARD_SHADOW, Course, DIFFICULTY_BG, DIFFICULTY_TEXT_COLOR } from '../constants';

type Props = {
  course: Course;
  style?: StyleProp<ViewStyle>;
};

export function TrackingCourseCard({ course, style }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View
      className="absolute left-4 right-4 bg-fill-normal overflow-hidden"
      style={[{ borderRadius: 12, ...CARD_SHADOW }, style]}
    >
      {/* 상단 행: 뱃지 + 코스 이름 + chevron */}
      <TouchableOpacity
        className="flex-row items-center p-3 gap-2.5"
        activeOpacity={0.7}
        onPress={() => setIsExpanded((v) => !v)}
      >
        {/* 난이도 뱃지 */}
        <View className={`rounded px-1 py-0.5 ${DIFFICULTY_BG[course.difficulty]}`}>
          <Text className={`typo-caption-1-medium ${DIFFICULTY_TEXT_COLOR[course.difficulty]}`}>
            {course.difficulty}
          </Text>
        </View>
        {/* 코스 이름 */}
        <Text className="flex-1 typo-body-1-normal-semi-bold text-label-normal">
          {course.name}
        </Text>
        <View style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
          <ChevronDownIcon size={20} />
        </View>
      </TouchableOpacity>

      {/* 펼침 상태 — 코스 상세 정보 */}
      {isExpanded && (
        <View className="px-3 pb-3 gap-1.5">
          {/* 행 1: 고도 | 거리 */}
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <AltitudeIcon />
              <Text className="typo-caption-1-medium text-label-subtler">
                고도 {course.altitudeNm}Nm
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <DistanceIcon />
              <Text className="typo-caption-1-medium text-label-subtler">
                거리 {course.distanceKm}km
              </Text>
            </View>
          </View>

          {/* 상승 | 하강 | 소요시간 */}
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
        </View>
      )}
    </View>
  );
}
