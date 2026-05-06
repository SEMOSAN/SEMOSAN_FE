import { LocationIcon } from '@/components/icons/location-icon';
import { TrackingCourseCard } from '@/features/tracking/components/tracking-course-card';
import { CollapsedCourseCard } from '@/features/tracking/components/collapsed-course-card';
import { SummitSheet } from '@/features/tracking/components/summit-sheet';
import { StopConfirmModal } from '@/features/tracking/components/stop-confirm-modal';
import { DifficultyRatingModal } from '@/features/tracking/components/difficulty-rating-modal';
import { TrailAvatarMarker } from '@/features/tracking/components/trail-avatar-marker';
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
  TRAIL_BAR_COLORS,
  LOCATION_BUTTON_GAP,
  TRACKING_COURSE_CARD_HEIGHT,
  TRACKING_COURSE_CARD_TOP,
  TRACKING_SHEET_HEIGHT,
  TRAIL_BAR_GAP,
  TRAIL_BAR_LEFT,
  TRAIL_MARKER_LEFT,
  TRAIL_BAR_LOCATIONS,
  TRAIL_BAR_WIDTH,
} from '@/features/tracking/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Text, TouchableOpacity, View } from 'react-native';

export default function TrackingScreen() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  // TODO: 실제 구현 시 GPS 좌표 기반으로 정상 도달 여부 판단
  const [isAtSummit, setIsAtSummit] = useState(true); // 목 값
  const [showSummitSheet, setShowSummitSheet] = useState(false);
  const [trackingSheetHeight, setTrackingSheetHeight] = useState(TRACKING_SHEET_HEIGHT);
  const [showStopModal, setShowStopModal] = useState(false);
  const [showDifficultyRating, setShowDifficultyRating] = useState(false);
  // 그라데이션 바 레이아웃 (map 영역 내 좌표)
  const [barLayout, setBarLayout] = useState<{ top: number; height: number } | null>(null);
  // 마커 Y 비율: 0.0(바 상단/최고도) ~ 1.0(바 하단/최저도), 추후 실제 고도로 대체
  const markerRatio = 0.8;

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

  // 트래킹 중 경과 시간 카운트업 (일시정지 시 멈춤)
  useEffect(() => {
    if (!isTracking || isPaused) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  const pauseTracking = () => setIsPaused(true);
  const resumeTracking = () => setIsPaused(false);
  const requestStop = () => setShowStopModal(true);

  /** StopConfirmModal → 난이도 체감 화면으로 전환 */
  const finishTracking = () => {
    setShowStopModal(false);
    setShowDifficultyRating(true);
  };

  /** 난이도 체감 완료 후 상태 초기화 */
  const completeTracking = () => {
    setShowDifficultyRating(false);
    setIsTracking(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setShowTooltip(true);
    setShowSummitSheet(false);
    setCollapsed(false);
  };

  // GPS로 정상 부근 감지 시 자동으로 정상 시트 표시
  // TODO: 실제 구현 시 GPS 좌표와 정상 좌표를 비교해 isAtSummit 업데이트
  useEffect(() => {
    if (isTracking && isAtSummit) {
      setShowSummitSheet(true);
    }
  }, [isAtSummit, isTracking]);

  const floatingCardBottom = COLLAPSED_PEEK_HEIGHT + FLOATING_CARD_GAP;

  return (
    <View className="flex-1 bg-fill-stronger">
      {/* 트래킹 중 탭바 숨기기 */}
      <Tabs.Screen options={{ tabBarStyle: isTracking ? { display: 'none' } : undefined }} />

      {/* 지도 영역 */}
      <TouchableOpacity
        activeOpacity={1}
        className="flex-1 bg-fill-stronger items-center justify-center"
        onPress={() => !isTracking && setCollapsed(true)}
      >
        <Text className="typo-body-2-normal-medium text-label-disabled">지도 영역</Text>

        {/* 트래킹 중 — 고도 그라데이션 바 + 아바타 마커 */}
        {isTracking && (
          <>
            <LinearGradient
              colors={TRAIL_BAR_COLORS}
              locations={TRAIL_BAR_LOCATIONS}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              onLayout={(e) => {
                const { y, height } = e.nativeEvent.layout;
                setBarLayout({ top: y, height });
              }}
              style={{
                position: 'absolute',
                left: TRAIL_BAR_LEFT,
                top: TRACKING_COURSE_CARD_TOP + TRACKING_COURSE_CARD_HEIGHT + TRAIL_BAR_GAP,
                bottom: TRAIL_BAR_GAP,
                width: TRAIL_BAR_WIDTH,
                borderRadius: 999,
              }}
            />
            {barLayout && (
              <TrailAvatarMarker
                left={TRAIL_MARKER_LEFT}
                centerY={barLayout.top + barLayout.height * markerRatio}
              />
            )}
          </>
        )}
      </TouchableOpacity>

      {/* 트래킹 중 — 상단 코스 카드 */}
      {isTracking && (
        <TrackingCourseCard
          course={selectedCourse}
          style={{ top: TRACKING_COURSE_CARD_TOP }}
        />
      )}

      {/* 위치 버튼 */}
      <TouchableOpacity
        className="absolute right-4 bg-fill-normal rounded-full w-12 h-12 items-center justify-center"
        style={{
          bottom: isTracking
            ? trackingSheetHeight + LOCATION_BUTTON_GAP
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
        <View onLayout={(e: LayoutChangeEvent) => setTrackingSheetHeight(e.nativeEvent.layout.height)}>
          {showSummitSheet ? (
            <SummitSheet
              onCertify={() => setShowDifficultyRating(true)}
              onNotYet={() => setShowSummitSheet(false)}
            />
          ) : (
            <TrackingSheet
              elapsedSeconds={elapsedSeconds}
              isPaused={isPaused}
              showTooltip={showTooltip}
              hasSummited={false}
              timeToTarget="04:00"
              distanceToTarget="500m"
              onDismissTooltip={() => setShowTooltip(false)}
              onPause={pauseTracking}
              onResume={resumeTracking}
              onStop={requestStop}
            />
          )}
        </View>
      )}

      {/* 카운트다운 오버레이 */}
      {countdown !== null && countdown > 0 && (
        <CountdownOverlay
          countdown={countdown}
          onClose={() => setCountdown(null)}
        />
      )}

      {/* 기록 종료 확인 모달 */}
      <StopConfirmModal
        visible={showStopModal}
        onCancel={() => setShowStopModal(false)}
        onConfirm={finishTracking}
      />

      {/* 난이도 체감 모달 */}
      <DifficultyRatingModal
        visible={showDifficultyRating}
        course={selectedCourse}
        mountainName="관악산"
        onClose={completeTracking}
        onComplete={completeTracking}
      />
    </View>
  );
}
