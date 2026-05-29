import { AltitudeIcon } from '@/components/icons/altitude-icon';
import { ClockIcon } from '@/components/icons/clock-icon';
import { DistanceIcon } from '@/components/icons/distance-icon';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  CARD_SHADOW,
  COLLAPSED_PEEK_HEIGHT,
  Course,
  DIFFICULTY_BG,
  DIFFICULTY_TEXT_COLOR,
  FLOATING_CARD_GAP,
  FLOATING_CARD_HORIZONTAL_MARGIN,
} from '../constants';

type Props = {
  course: Course;
  onExpand: () => void;
  onStartCountdown: () => void;
};

export function CollapsedCourseCard({ course, onExpand, onStartCountdown }: Props) {
  const floatingCardBottom = COLLAPSED_PEEK_HEIGHT + FLOATING_CARD_GAP;

  return (
    <>
      {/* 바텀시트 peek (핸들만 노출) */}
      <TouchableOpacity
        activeOpacity={1}
        className="absolute left-0 right-0 bg-fill-normal items-center justify-center"
        style={{
          bottom: 0,
          height: COLLAPSED_PEEK_HEIGHT,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        onPress={onExpand}
      >
        <View className="w-10 h-1 rounded-full bg-fill-neutral" />
      </TouchableOpacity>

      {/* 플로팅 코스 카드 */}
      <View
        className="absolute bg-fill-normal overflow-hidden p-3 gap-2.5"
        style={{
          bottom: floatingCardBottom,
          left: FLOATING_CARD_HORIZONTAL_MARGIN,
          right: FLOATING_CARD_HORIZONTAL_MARGIN,
          borderRadius: 12,
          ...CARD_SHADOW,
        }}
      >
        {/* 코스 정보 블록 */}
        <View className="gap-2 self-stretch">
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
              <Text className="typo-caption-1-medium text-label-subtler">
                고도 {course.altitudeNm != null ? `${course.altitudeNm}m` : '-'}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <DistanceIcon />
              <Text className="typo-caption-1-medium text-label-subtler">거리 {course.distanceKm}km</Text>
            </View>
          </View>

          {/* 정상까지 거리 + 하산까지 거리 + 소요시간 */}
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-1">
              <Text className="typo-caption-1-medium text-label-subtler">
                정상까지 {course.summitDistanceM >= 1000 ? `${(course.summitDistanceM / 1000).toFixed(1)}km` : `${course.summitDistanceM}m`}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Text className="typo-caption-1-medium text-label-subtler">
                하산까지 {course.descentDistanceM >= 1000 ? `${(course.descentDistanceM / 1000).toFixed(1)}km` : `${course.descentDistanceM}m`}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <ClockIcon />
              <Text className="typo-caption-1-medium text-label-subtler">
                소요시간 {course.durationHours}h{course.durationMinutes}m
              </Text>
            </View>
          </View>
        </View>

        {/* 코스 따라가기 버튼 */}
        <TouchableOpacity
          className="self-stretch flex-row items-center justify-center px-4 gap-2 rounded-lg border border-line-normal bg-fill-normal"
          style={{ height: 38 }}
          onPress={onStartCountdown}
        >
          <Text className="typo-label-large text-label-normal">코스 따라가기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
