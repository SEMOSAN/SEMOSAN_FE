import { LocationIcon } from '@/components/icons/location-icon';
import { CollapsedCourseCard } from '@/features/tracking/components/collapsed-course-card';
import { CountdownOverlay } from '@/features/tracking/components/countdown-overlay';
import { CourseSelectSheet } from '@/features/tracking/components/course-select-sheet';
import { TrackingSheet } from '@/features/tracking/components/tracking-sheet';
import {
  CARD_SHADOW,
  COLLAPSED_PEEK_HEIGHT,
  DIFFICULTY_BG,
  DIFFICULTY_TEXT_COLOR,
  FLOATING_CARD_GAP,
  MOCK_COURSES,
  SHADOW,
} from '@/features/tracking/constants';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg } from 'react-native-svg';

export default function TrackingScreen() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  const selectedCourse = MOCK_COURSES.find((c) => c.id === selectedCourseId) ?? MOCK_COURSES[0];

  const startCountdown = () => setCountdown(3);

  // 카운트다운 → 0이 되면 트래킹 시작
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setIsTracking(true);
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // 트래킹 중 경과 시간 카운트업
  useEffect(() => {
    if (!isTracking) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTracking]);

  const stopTracking = () => {
    setIsTracking(false);
    setElapsedSeconds(0);
    setShowTooltip(true);
    setCollapsed(false);
  };

  const floatingCardBottom = COLLAPSED_PEEK_HEIGHT + FLOATING_CARD_GAP;

  return (
    <View className="flex-1 bg-fill-stronger">
      {/* 지도 영역 */}
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 bg-fill-stronger items-center justify-center"
        onPress={() => !isTracking && setCollapsed(true)}
      >
        <Text className="typo-body-2-normal-medium text-label-disabled">지도 영역</Text>
      </TouchableOpacity>

      {/* 트래킹 중 — 상단 코스 카드 */}
      {isTracking && (
        <View
          className="absolute left-4 bg-fill-normal overflow-hidden"
          style={{ top: 56, borderRadius: 20, ...CARD_SHADOW }}
        >
          <View className="flex-row items-center gap-2 px-3 py-2">
            <View className={`rounded px-1 py-0.5 ${DIFFICULTY_BG[selectedCourse.difficulty]}`}>
              <Text className={`typo-caption-1-medium ${DIFFICULTY_TEXT_COLOR[selectedCourse.difficulty]}`}>
                {selectedCourse.difficulty}
              </Text>
            </View>
            <Text className="typo-body-1-normal-semi-bold text-label-normal">{selectedCourse.name}</Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path d="M5 7.5L10 12.5L15 7.5" stroke="#73798C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        </View>
      )}

      {/* 위치 버튼 */}
      <TouchableOpacity
        className="absolute right-4 bg-fill-normal rounded-full w-12 h-12 items-center justify-center"
        style={{
          bottom: isTracking
            ? 200 + FLOATING_CARD_GAP
            : collapsed
              ? floatingCardBottom + FLOATING_CARD_GAP
              : 448 + FLOATING_CARD_GAP,
          ...SHADOW,
        }}
      >
        <LocationIcon />
      </TouchableOpacity>

      {/* Expanded 바텀시트 */}
      {!isTracking && !collapsed && (
        <CourseSelectSheet
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onFreeRecord={() => {}}
          onStartCountdown={startCountdown}
        />
      )}

      {/* Collapsed 바텀시트 */}
      {!isTracking && collapsed && (
        <CollapsedCourseCard
          course={selectedCourse}
          onExpand={() => setCollapsed(false)}
          onStartCountdown={startCountdown}
        />
      )}

      {/* 트래킹 중 바텀시트 */}
      {isTracking && (
        <TrackingSheet
          elapsedSeconds={elapsedSeconds}
          showTooltip={showTooltip}
          onDismissTooltip={() => setShowTooltip(false)}
          onStop={stopTracking}
        />
      )}

      {/* 카운트다운 오버레이 */}
      {countdown !== null && countdown > 0 && (
        <CountdownOverlay
          countdown={countdown}
          onClose={() => setCountdown(null)}
        />
      )}
    </View>
  );
}
