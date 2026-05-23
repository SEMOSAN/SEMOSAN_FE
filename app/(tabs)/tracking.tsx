import { LocationIcon } from "@/components/icons/location-icon";
import { CollapsedCourseCard } from "@/features/tracking/components/collapsed-course-card";
import { CountdownOverlay } from "@/features/tracking/components/countdown-overlay";
import { CourseSelectSheet } from "@/features/tracking/components/course-select-sheet";
import { DifficultyRatingModal } from "@/features/tracking/components/difficulty-rating-modal";
import { FreeRecordConfirmModal } from "@/features/tracking/components/free-record-confirm-modal";
import { StopConfirmModal } from "@/features/tracking/components/stop-confirm-modal";
import { SummitSheet } from "@/features/tracking/components/summit-sheet";
import { TrackingCourseCard } from "@/features/tracking/components/tracking-course-card";
import { TrackingSheet } from "@/features/tracking/components/tracking-sheet";
import { TrailAvatarMarker } from "@/features/tracking/components/trail-avatar-marker";
import {
  COLLAPSED_PEEK_HEIGHT,
  FLOATING_CARD_GAP,
  LOCATION_BUTTON_GAP,
  MOCK_COURSES,
  SHADOW,
  TRACKING_COURSE_CARD_HEIGHT,
  TRACKING_COURSE_CARD_TOP,
  TRACKING_SHEET_HEIGHT,
  TRAIL_BAR_COLORS,
  TRAIL_BAR_GAP,
  TRAIL_BAR_LEFT,
  TRAIL_BAR_LOCATIONS,
  TRAIL_BAR_WIDTH,
  TRAIL_MARKER_LEFT,
} from "@/features/tracking/constants";
import { useNearbyMountain } from "@/features/tracking/hooks/use-nearby-mountain";
import { useStartTrackingSession } from "@/features/tracking/hooks/use-start-tracking-session";
import { usePauseTrackingSession } from "@/features/tracking/hooks/use-pause-tracking-session";
import { useResumeTrackingSession } from "@/features/tracking/hooks/use-resume-tracking-session";
import { useCompleteTrackingSession } from "@/features/tracking/hooks/use-complete-tracking-session";
import { useActiveTrackingSession } from "@/features/tracking/hooks/use-active-tracking-session";
import { PhotoWindowPayload, useTrackingSocket } from "@/features/tracking/hooks/use-tracking-socket";
import { PhotoWindowBanner } from "@/features/tracking/components/photo-window-banner";
import { useTrackingFcm } from "@/features/tracking/hooks/use-tracking-fcm";
import { isLiveActivityEnabled } from "@/constants/platform";
import { LiveActivity } from "@/modules/live-activity";
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
} from "@mj-studio/react-native-naver-map";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function TrackingScreen() {
  const { collapse: collapseParameter, courseId: courseIdParameter } =
    useLocalSearchParams<{
      collapse?: string;
      courseId?: string;
    }>();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    courseIdParameter ?? null,
  );
  const [collapsed, setCollapsed] = useState(collapseParameter === "true");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  // TODO: 실제 구현 시 GPS 좌표 기반으로 정상 도달 여부 판단
  const [isAtSummit, setIsAtSummit] = useState(false); // 목 값 (GPS 연동 전까지 false)
  const [showSummitSheet, setShowSummitSheet] = useState(false);
  const [trackingSheetHeight, setTrackingSheetHeight] = useState(
    TRACKING_SHEET_HEIGHT,
  );
  const [showStopModal, setShowStopModal] = useState(false);
  const [showDifficultyRating, setShowDifficultyRating] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [hasSummited, setHasSummited] = useState(false);
  const [photoWindow, setPhotoWindow] = useState<PhotoWindowPayload | null>(null);
  const [showFreeRecordModal, setShowFreeRecordModal] = useState(false);
  // 그라데이션 바 레이아웃 (map 영역 내 좌표)
  const [barLayout, setBarLayout] = useState<{
    top: number;
    height: number;
  } | null>(null);
  // 마커 Y 비율: 0.0(바 상단/최고도) ~ 1.0(바 하단/최저도), 추후 실제 고도로 대체
  const markerRatio = 0.8;
  // 사용자 현재 위치
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 위치 권한 요청 및 현재 위치 조회
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.warn("[Location] 현재 위치 조회 실패:", error);
      }
    })();
  }, []);

  const { data: nearbyData, isLoading: isNearbyLoading } = useNearbyMountain({
    lat: userLocation?.latitude ?? null,
    lng: userLocation?.longitude ?? null,
  });

  const handlePhotoWindow = useCallback((payload: PhotoWindowPayload) => {
    if (payload.status === 'OPEN') {
      setPhotoWindow(payload);
    } else {
      setPhotoWindow(null);
    }
  }, []);

  const { connect: connectSocket, disconnect: disconnectSocket, subscribePhotoWindow } = useTrackingSocket({
    onPhotoWindow: handlePhotoWindow,
  });

  // 포어그라운드 FCM 수신 (백그라운드는 OS가 시스템 알림으로 자동 처리)
  useTrackingFcm({ enabled: isTracking, onPhotoWindow: handlePhotoWindow });

  const { mutate: startSession } = useStartTrackingSession();
  const { mutate: pauseSession } = usePauseTrackingSession();
  const { mutate: resumeSession } = useResumeTrackingSession();
  const { mutate: completeSession } = useCompleteTrackingSession();
  const { data: activeSession, refetch: refetchActiveSession } = useActiveTrackingSession();

  // 앱 재진입 시 진행 중인 세션 복원
  useFocusEffect(
    useCallback(() => {
      // 이미 트래킹 중이면 재조회 불필요
      if (isTracking) return;
      refetchActiveSession();
    }, [isTracking, refetchActiveSession]),
  );

  useEffect(() => {
    if (!activeSession?.sessionId) return;
    if (isTracking) return; // 이미 복원된 경우 무시

    const status = activeSession.status;
    if (status === 'IN_PROGRESS' || status === 'PAUSED') {
      setSessionId(activeSession.sessionId);
      setIsTracking(true);
      setIsPaused(status === 'PAUSED');
      connectSocket(activeSession.sessionId);
      // 일시정지된 경우 경과 시간 복원 (pausedSecondsTotal 제외한 실제 등산 시간)
      if (activeSession.startedAt) {
        const startedMs = new Date(activeSession.startedAt).getTime();
        const nowMs = Date.now();
        const totalElapsed = Math.floor((nowMs - startedMs) / 1000);
        const pausedSeconds = activeSession.pausedSecondsTotal ?? 0;
        setElapsedSeconds(Math.max(0, totalElapsed - pausedSeconds));
      }
    }
  }, [activeSession]);

  const selectedCourse =
    MOCK_COURSES.find((c) => c.id === selectedCourseId) ?? MOCK_COURSES[0];
  const selectedCourseId_num = selectedCourseId ? Number(selectedCourseId) : null;

  const startCountdown = (freeMode = false) => {
    if (freeMode) setIsFreeMode(true);
    setCountdown(3);
  };

  const handleFreeRecord = () => startCountdown(true);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setIsTracking(true);
      setCountdown(null);

      // 트래킹 세션 시작 API 호출
      const mountainId = nearbyData?.mountain?.mountainId;
      if (mountainId != null) {
        startSession(
          {
            mountainId,
            courseId: isFreeMode ? undefined : (selectedCourseId_num ?? undefined),
            isFreeRecording: isFreeMode,
          },
          {
            onSuccess: (data) => {
              if (data.sessionId != null) {
                setSessionId(data.sessionId);
                // 세션 ID 확정 후 웹소켓 연결 및 photo-window 구독
                connectSocket(data.sessionId);
              }
            },
            onError: (err) => {
              console.warn('[Tracking] 세션 시작 실패:', err);
            },
          },
        );
      }
      return;
    }
    const timer = setTimeout(
      () => setCountdown((c) => (c !== null ? c - 1 : null)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [countdown]);

  // 트래킹 시작 시 Live Activity 시작
  useEffect(() => {
    if (!isTracking) return;

    if (isLiveActivityEnabled) {
      if (isFreeMode) {
        LiveActivity.start({ mode: "free" }).catch(() => {});
      } else {
        const totalMinutes =
          selectedCourse.durationHours * 60 + selectedCourse.durationMinutes;
        const totalMeters = Math.round(selectedCourse.distanceKm * 1000);
        LiveActivity.start({
          mode: "course",
          remainingMinutes: totalMinutes,
          remainingMeters: totalMeters,
          progress: 0,
        }).catch(() => {});
      }
    }

    return () => {};
  }, [isTracking, isFreeMode, selectedCourse]);

  // 트래킹 중 경과 시간 카운트업 (일시정지 시 멈춤)
  useEffect(() => {
    if (!isTracking || isPaused) return;
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTracking, isPaused]);

  // 매 초 Live Activity 업데이트
  useEffect(() => {
    if (!isTracking) return;

    if (isLiveActivityEnabled) {
      if (isFreeMode) {
        LiveActivity.update({
          elapsedSeconds,
          isRunning: !isPaused,
          mode: "free",
        }).catch(() => {});
      } else {
        const totalSeconds =
          (selectedCourse.durationHours * 60 + selectedCourse.durationMinutes) *
          60;
        const totalMeters = Math.round(selectedCourse.distanceKm * 1000);
        const progress =
          totalSeconds > 0 ? Math.min(elapsedSeconds / totalSeconds, 1) : 0;
        const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);
        LiveActivity.update({
          elapsedSeconds,
          isRunning: !isPaused,
          mode: "course",
          remainingMinutes: Math.ceil(remainingSeconds / 60),
          remainingMeters: Math.round(totalMeters * (1 - progress)),
          progress,
        }).catch(() => {});
      }
    }
  }, [elapsedSeconds, isPaused, isFreeMode, selectedCourse]);

  const pauseTracking = () => {
    setIsPaused(true);
    if (sessionId != null) {
      pauseSession(sessionId, {
        onError: (err) => console.warn('[Tracking] 일시정지 실패:', err),
      });
    }
  };
  const resumeTracking = () => {
    setIsPaused(false);
    if (sessionId != null) {
      resumeSession(sessionId, {
        onError: (err) => console.warn('[Tracking] 재개 실패:', err),
      });
    }
  };

  const requestStop = () => setShowStopModal(true);

  /** StopConfirmModal → 난이도 체감 화면으로 전환 */
  const finishTracking = () => {
    setShowStopModal(false);
    // 정상 인증 없이 기록 종료하는 경우 세션 완료 API 호출
    // (정상 인증 시에는 onCertify에서 이미 호출했으므로 중복 방지)
    if (!hasSummited && sessionId != null) {
      completeSession(sessionId, {
        onError: (err) => console.warn('[Tracking] 세션 종료 실패:', err),
      });
    }
    setShowDifficultyRating(true);
  };

  /** 난이도 체감 완료 후 상태 초기화 */
  const completeTracking = () => {
    if (isLiveActivityEnabled) LiveActivity.stop().catch(() => {});
    disconnectSocket();
    setShowDifficultyRating(false);
    setIsTracking(false);
    setIsPaused(false);
    setIsFreeMode(false);
    setElapsedSeconds(0);
    setShowTooltip(true);
    setShowSummitSheet(false);
    setHasSummited(false);
    setSessionId(null);
    setPhotoWindow(null);
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
      <Tabs.Screen
        options={{ tabBarStyle: isTracking ? { display: "none" } : undefined }}
      />

      {/* 지도 영역 */}
      <View style={styles.mapContainer}>
        <NaverMapView
          style={styles.map}
          camera={{
            latitude: selectedCourse.centerLatitude,
            longitude: selectedCourse.centerLongitude,
            zoom: selectedCourse.zoom,
          }}
        >
          {/* 코스 경로 */}
          <NaverMapPathOverlay
            coords={selectedCourse.coordinates}
            width={6}
            color="#4ADE80"
          />

          {/* 출발지 마커 */}
          {selectedCourse.coordinates[0] && (
            <NaverMapMarkerOverlay
              latitude={selectedCourse.coordinates[0].latitude}
              longitude={selectedCourse.coordinates[0].longitude}
              caption={{ text: "출발" }}
            />
          )}

          {/* 도착지 마커 */}
          {selectedCourse.coordinates.length > 0 && (
            <NaverMapMarkerOverlay
              latitude={
                selectedCourse.coordinates[
                  selectedCourse.coordinates.length - 1
                ].latitude
              }
              longitude={
                selectedCourse.coordinates[
                  selectedCourse.coordinates.length - 1
                ].longitude
              }
              caption={{ text: "도착" }}
            />
          )}

          {/* 현재 사용자 위치 마커 */}
          {userLocation && (
            <NaverMapMarkerOverlay
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              caption={{ text: "내 위치" }}
            />
          )}
        </NaverMapView>

        {/* 사진 윈도우 배너 — 지도 위 오버레이 */}
        {isTracking && photoWindow?.status === 'OPEN' && (
          <View style={{ position: 'absolute', top: TRACKING_COURSE_CARD_TOP + TRACKING_COURSE_CARD_HEIGHT + 8, left: 0, right: 0, zIndex: 10 }}>
            <PhotoWindowBanner milestoneDistance={photoWindow.milestoneDistance} />
          </View>
        )}

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
                position: "absolute",
                left: TRAIL_BAR_LEFT,
                top:
                  TRACKING_COURSE_CARD_TOP +
                  TRACKING_COURSE_CARD_HEIGHT +
                  TRAIL_BAR_GAP,
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
      </View>

      {/* 트래킹 중 — 상단 코스 카드 */}
      {isTracking && (
        <TrackingCourseCard
          course={selectedCourse}
          style={{ top: TRACKING_COURSE_CARD_TOP }}
        />
      )}

      {/* 위치 버튼 */}
      <TouchableOpacity
        className="absolute right-4 h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
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
          mountain={nearbyData?.mountain}
          courses={nearbyData?.courses}
          isLoading={isNearbyLoading}
          selectedCourseId={selectedCourseId_num}
          onSelectCourse={(id) => setSelectedCourseId(String(id))}
          onFreeRecord={handleFreeRecord}
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
        <View
          onLayout={(e: LayoutChangeEvent) =>
            setTrackingSheetHeight(e.nativeEvent.layout.height)
          }
        >
          {showSummitSheet ? (
            <SummitSheet
              onCertify={() => {
                const proceedToDescentSheet = () => {
                  setHasSummited(true);
                  setShowSummitSheet(false);
                };
                if (sessionId != null) {
                  completeSession(sessionId, {
                    onSuccess: proceedToDescentSheet,
                    onError: (err) => {
                      console.warn('[Tracking] 세션 종료 실패:', err);
                      proceedToDescentSheet(); // 실패해도 하산 시트로 진행
                    },
                  });
                } else {
                  proceedToDescentSheet();
                }
              }}
              onNotYet={() => setShowSummitSheet(false)}
            />
          ) : (
            <TrackingSheet
              elapsedSeconds={elapsedSeconds}
              isPaused={isPaused}
              showTooltip={showTooltip}
              isPhotoWindowOpen={photoWindow?.status === 'OPEN'}
              hasSummited={hasSummited}
              timeToTarget="04:00"
              distanceToTarget="500m"
              onDismissTooltip={() => setShowTooltip(false)}
              onPause={pauseTracking}
              onResume={resumeTracking}
              onStop={requestStop}
              onSummit={() => setShowSummitSheet(true)}
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

      {/* 자유 기록 시작 확인 모달 */}
      <FreeRecordConfirmModal
        visible={showFreeRecordModal}
        onCancel={() => setShowFreeRecordModal(false)}
        onConfirm={() => {
          setShowFreeRecordModal(false);
          startCountdown();
        }}
      />

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

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
