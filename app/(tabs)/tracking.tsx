import { LocationIcon } from "@/components/icons/location-icon";
import { isLiveActivityEnabled } from "@/constants/platform";
import { CollapsedCourseCard } from "@/features/tracking/components/collapsed-course-card";
import { CountdownOverlay } from "@/features/tracking/components/countdown-overlay";
import { CourseSelectSheet } from "@/features/tracking/components/course-select-sheet";
import { DifficultyRatingModal } from "@/features/tracking/components/difficulty-rating-modal";
import { FreeRecordConfirmModal } from "@/features/tracking/components/free-record-confirm-modal";
import { PhotoWindowBanner } from "@/features/tracking/components/photo-window-banner";
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
import { useActiveTrackingSession } from "@/features/tracking/hooks/use-active-tracking-session";
import { useCompleteTrackingSession } from "@/features/tracking/hooks/use-complete-tracking-session";
import { useCourseDetail } from "@/features/tracking/hooks/use-course-detail";
import { useNearbyMountain } from "@/features/tracking/hooks/use-nearby-mountain";
import { usePauseTrackingSession } from "@/features/tracking/hooks/use-pause-tracking-session";
import { useResumeTrackingSession } from "@/features/tracking/hooks/use-resume-tracking-session";
import { useSaveTrackingPhoto } from "@/features/tracking/hooks/use-save-tracking-photo";
import { useStartTrackingSession } from "@/features/tracking/hooks/use-start-tracking-session";
import { useTrackingFcm } from "@/features/tracking/hooks/use-tracking-fcm";
import {
  PhotoWindowPayload,
  useTrackingSocket,
} from "@/features/tracking/hooks/use-tracking-socket";
import { parseCoursePolyline } from "@/features/tracking/utils/parse-course-polyline";
import { uploadTrackingPhoto } from "@/features/tracking/utils/upload-tracking-photo";
import { useAppState } from "@/hooks/use-app-state";
import { LiveActivity } from "@/modules/live-activity";
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TrackingScreen() {
  const { collapse: collapseParameter, courseId: courseIdParameter } =
    useLocalSearchParams<{
      collapse?: string;
      courseId?: string;
    }>();
  // [DEV] 관악산 코스 1 (courseId=205) 하드코딩 — GPX 없는 인근산 테스트용, 확인 후 제거
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    courseIdParameter ?? "205",
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
  const [photoWindow, setPhotoWindow] = useState<PhotoWindowPayload | null>(
    null,
  );
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
    altitude: number | null;
  } | null>(null);
  const locationWatchRef = useRef<Location.LocationSubscription | null>(null);
  const backgroundedAtRef = useRef<number | null>(null);
  const mapRef = useRef<NaverMapViewRef>(null);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 위치 권한 요청 및 현재 위치 조회 (진입 시 1회)
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          altitude: loc.coords.altitude,
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
    console.log("[PhotoWindow] 수신:", JSON.stringify(payload));
    if (payload.status === "OPEN") {
      setPhotoWindow(payload);
    } else {
      setPhotoWindow(null);
    }
  }, []);

  const {
    connect: connectSocket,
    disconnect: disconnectSocket,
    subscribePhotoWindow,
    publishGps,
  } = useTrackingSocket({
    onPhotoWindow: handlePhotoWindow,
  });

  // 포어그라운드 FCM 수신 (백그라운드는 OS가 시스템 알림으로 자동 처리)
  useTrackingFcm({ enabled: isTracking, onPhotoWindow: handlePhotoWindow });

  const { mutate: startSession } = useStartTrackingSession();
  const { mutate: pauseSession } = usePauseTrackingSession();
  const { mutate: resumeSession } = useResumeTrackingSession();
  const { mutate: completeSession } = useCompleteTrackingSession();
  const { mutateAsync: savePhoto } = useSaveTrackingPhoto();
  const { data: activeSession, refetch: refetchActiveSession } =
    useActiveTrackingSession();

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
    if (status === "IN_PROGRESS" || status === "PAUSED") {
      setSessionId(activeSession.sessionId);
      setIsTracking(true);
      setIsPaused(status === "PAUSED");
      connectSocket(activeSession.sessionId);
      // GPS watch 재시작
      const sid = activeSession.sessionId;
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 3000,
          distanceInterval: 10,
        },
        (loc) => {
          const { latitude, longitude, altitude } = loc.coords;
          setUserLocation({ latitude, longitude, altitude });
          publishGps(sid, {
            lat: latitude,
            lng: longitude,
            altitude: altitude,
            recordedAt: new Date(loc.timestamp).toISOString(),
          });
        },
      )
        .then((sub) => {
          locationWatchRef.current = sub;
        })
        .catch((err) => console.warn("[Location] watch 재시작 실패:", err));
      setElapsedSeconds(0);
    }
  }, [activeSession]);

  const selectedCourseId_num = selectedCourseId
    ? Number(selectedCourseId)
    : null;
  // [DEV] 관악산 polyline 테스트용 임시 하드코딩 — 확인 후 제거
  const DEV_TEST_COURSE_ID = 205;

  const { data: courseDetail } = useCourseDetail(
    isFreeMode ? null : (selectedCourseId_num ?? DEV_TEST_COURSE_ID),
  );

  const courseCoords = useMemo(
    () => parseCoursePolyline(courseDetail?.polyline),
    [courseDetail?.polyline],
  );

  // [DEV] 코스 polyline 좌표를 순서대로 빠르게 publish → 백엔드 마일스톤 트리거 테스트
  const startCoordSimulation = useCallback(() => {
    if (!sessionId) return;
    if (simIntervalRef.current) {
      console.warn("[SIM] 이미 실행 중");
      return;
    }
    const coords = courseCoords;
    console.log(
      "[SIM] isFreeMode:",
      isFreeMode,
      "courseCoords.length:",
      coords.length,
      "sessionId:",
      sessionId,
    );
    if (coords.length === 0) {
      console.warn("[SIM] 코스 좌표 없음 — courseDetail polyline 확인 필요");
      return;
    }
    let idx = 0;
    console.log(`[SIM] 시작 — 총 ${coords.length}개 좌표`);
    simIntervalRef.current = setInterval(() => {
      if (idx >= coords.length) {
        clearInterval(simIntervalRef.current!);
        simIntervalRef.current = null;
        console.log("[SIM] 완료");
        return;
      }
      const { latitude, longitude } = coords[idx];
      publishGps(sessionId, {
        lat: latitude,
        lng: longitude,
        altitude: 0,
        recordedAt: new Date().toISOString(),
      });
      console.log(
        `[SIM] ${idx + 1}/${coords.length} (${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
      );
      idx++;
    }, 300); // 0.3초 간격 — 빠른 테스트용 (실제는 3~5초)
  }, [sessionId, courseCoords, isFreeMode, publishGps]);

  const selectedCourse =
    MOCK_COURSES.find((c) => c.id === selectedCourseId) ?? MOCK_COURSES[0];

  // [DEV] 선택된 courseId 로그 (1회만)
  useEffect(() => {
    console.log("[Course] selectedCourseId:", selectedCourseId_num);
  }, [selectedCourseId_num]);

  useEffect(() => {
    console.log(
      "[Course] courseDetail polyline type:",
      typeof courseDetail?.polyline,
      "courseCoords.length:",
      courseCoords.length,
    );
    if (courseCoords[0]) {
      console.log(
        "[Course] 첫 좌표:",
        courseCoords[0].latitude,
        courseCoords[0].longitude,
      );
    }
  }, [courseCoords.length, isFreeMode, isTracking]);

  // polyline 로드되거나 트래킹 시작 시 카메라를 전체 경로가 보이도록 맞춤
  useEffect(() => {
    if (courseCoords.length < 2) return;
    const lats = courseCoords.map((c) => c.latitude);
    const lngs = courseCoords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const fit = () =>
      mapRef.current?.animateRegionTo({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: (maxLat - minLat) * 1.3,
        longitudeDelta: (maxLng - minLng) * 1.3,
      });
    // mapRef가 아직 마운트 전일 수 있으니 약간 지연
    const timer = setTimeout(fit, 300);
    return () => clearTimeout(timer);
  }, [courseDetail?.polyline, isTracking]);

  const startCountdown = (freeMode = false) => {
    setIsFreeMode(freeMode === true); // 이벤트 객체 등 non-boolean 방지
    setCountdown(3);
  };

  const handleFreeRecord = () => startCountdown(true);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setIsTracking(true);
      setCountdown(null);

      // 트래킹 세션 시작 API 호출
      // [DEV] 관악산 하드코딩 — 확인 후 nearbyData?.mountain?.mountainId 로 교체
      const mountainId = 2;
      if (mountainId != null) {
        startSession(
          {
            mountainId,
            courseId: isFreeMode
              ? undefined
              : (selectedCourseId_num ?? undefined),
            isFreeRecording: isFreeMode,
          },
          {
            onSuccess: (data) => {
              if (data.sessionId != null) {
                const sid = data.sessionId;
                setSessionId(sid);
                // 세션 ID 확정 후 웹소켓 연결 및 photo-window 구독
                connectSocket(sid);
                // GPS watch 시작 — 3초/10m 간격으로 좌표 발행
                Location.watchPositionAsync(
                  {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 3000,
                    distanceInterval: 10,
                  },
                  (loc) => {
                    const { latitude, longitude, altitude } = loc.coords;
                    setUserLocation({ latitude, longitude, altitude });
                    publishGps(sid, {
                      lat: latitude,
                      lng: longitude,
                      altitude: altitude,
                      recordedAt: new Date(loc.timestamp).toISOString(),
                    });
                  },
                )
                  .then((sub) => {
                    locationWatchRef.current = sub;
                  })
                  .catch((err) => {
                    console.warn("[Location] watch 시작 실패:", err);
                  });
              }
            },
            onError: (err: any) => {
              console.warn(
                "[Tracking] 세션 시작 실패:",
                err?.response?.data ?? err?.message ?? err,
              );
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

  // 백그라운드 진입 시 시각 저장, 포어그라운드 복귀 시 차이만큼 누적
  useAppState(
    useCallback(
      (state) => {
        if (!isTracking || isPaused) return;
        if (state === "background" || state === "inactive") {
          backgroundedAtRef.current = Date.now();
        } else if (state === "active" && backgroundedAtRef.current != null) {
          const diffSeconds = Math.floor(
            (Date.now() - backgroundedAtRef.current) / 1000,
          );
          setElapsedSeconds((s) => s + diffSeconds);
          backgroundedAtRef.current = null;
        }
      },
      [isTracking, isPaused],
    ),
  );

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
        onError: (err) => {
          console.warn("[Tracking] 일시정지 실패:", err);
          setIsPaused(false); // API 실패 시 UI 되돌리기
        },
      });
    }
  };
  const resumeTracking = () => {
    setIsPaused(false);
    if (sessionId != null) {
      resumeSession(sessionId, {
        onError: (err) => {
          console.warn("[Tracking] 재개 실패:", err);
          setIsPaused(true); // API 실패 시 UI 되돌리기
        },
      });
    }
  };

  const requestStop = () => setShowStopModal(true);

  const handleCameraPress = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      console.warn("[Camera] 카메라 권한 거부됨");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets?.[0]?.uri) return;

    // 사진 윈도우 OPEN 상태일 때 → MinIO 업로드 → 메타 저장
    if (photoWindow?.status === "OPEN" && sessionId != null) {
      try {
        const capturedAt = new Date().toISOString();
        const imageUrl = await uploadTrackingPhoto(result.assets[0].uri);
        console.log("[Tracking] 인증 사진 업로드 완료:", imageUrl);

        await savePhoto({
          sessionId,
          body: {
            milestoneIndex: photoWindow.milestoneIndex,
            milestoneDistanceM: photoWindow.milestoneDistance,
            imageUrl,
            capturedAt,
            lat: userLocation?.latitude ?? 0,
            lng: userLocation?.longitude ?? 0,
            altitude: userLocation?.altitude ?? 0,
          },
        });
        console.log("[Tracking] 사진 메타 저장 완료");
      } catch (err) {
        console.warn("[Tracking] 인증 사진 처리 실패:", err);
      }
    }
  };

  /** StopConfirmModal → 난이도 체감 화면으로 전환 */
  const finishTracking = () => {
    setShowStopModal(false);
    // 기록 종료 시 항상 세션 완료 API 호출 (정상 인증 여부와 무관)
    if (sessionId != null) {
      completeSession(sessionId, {
        onError: (err) => console.warn("[Tracking] 세션 종료 실패:", err),
      });
    }
    setShowDifficultyRating(true);
  };

  /** 난이도 체감 완료 후 상태 초기화 */
  const completeTracking = () => {
    if (isLiveActivityEnabled) LiveActivity.stop().catch(() => {});
    locationWatchRef.current?.remove();
    locationWatchRef.current = null;
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
          ref={mapRef}
          style={styles.map}
          camera={{
            latitude: 37.4449,
            longitude: 126.9636,
            zoom: 12,
          }}
        >
          {/* 코스 경로 — API polyline */}
          {courseCoords.length > 1 && (
            <>
              <NaverMapPathOverlay
                coords={courseCoords}
                width={6}
                color="#4ADE80"
              />
              <NaverMapMarkerOverlay
                latitude={courseCoords[0].latitude}
                longitude={courseCoords[0].longitude}
                caption={{ text: "출발" }}
              />
              <NaverMapMarkerOverlay
                latitude={courseCoords[courseCoords.length - 1].latitude}
                longitude={courseCoords[courseCoords.length - 1].longitude}
                caption={{ text: "도착" }}
              />
            </>
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
        {isTracking && photoWindow?.status === "OPEN" && (
          <View
            style={{
              position: "absolute",
              top: TRACKING_COURSE_CARD_TOP + TRACKING_COURSE_CARD_HEIGHT + 8,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <PhotoWindowBanner
              milestoneDistance={photoWindow.milestoneDistance}
            />
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
          // [DEV] 관악산 하드코딩 — 확인 후 제거
          mountain={{ mountainId: 2, name: "관악산", altitude: 632 }}
          courses={[
            {
              courseId: 205,
              name: "관악산 코스 1",
              difficulty: "HARD",
              distance: 8922.2,
              duration: 290,
            },
            {
              courseId: 206,
              name: "관악산 코스 2",
              difficulty: "NORMAL",
              distance: 6782.1,
              duration: 163,
            },
            {
              courseId: 209,
              name: "관악산 코스 5",
              difficulty: "NORMAL",
              distance: 6365.4,
              duration: 169,
            },
          ]}
          isLoading={false}
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
                // 정상 인증 → 하산 시트로만 전환 (세션 완료는 기록 종료 시)
                setHasSummited(true);
                setShowSummitSheet(false);
              }}
              onNotYet={() => setShowSummitSheet(false)}
            />
          ) : (
            <TrackingSheet
              elapsedSeconds={elapsedSeconds}
              isPaused={isPaused}
              showTooltip={showTooltip}
              isPhotoWindowOpen={photoWindow?.status === "OPEN"}
              hasSummited={hasSummited}
              timeToTarget="04:00"
              distanceToTarget="500m"
              onDismissTooltip={() => setShowTooltip(false)}
              onCameraPress={handleCameraPress}
              onPause={pauseTracking}
              onResume={resumeTracking}
              onStop={requestStop}
              onSummit={() => setShowSummitSheet(true)}
            />
          )}
        </View>
      )}

      {/* [DEV] 좌표 시뮬레이션 버튼 */}
      {isTracking && (
        <TouchableOpacity
          onPress={startCoordSimulation}
          style={{
            position: "absolute",
            bottom: trackingSheetHeight + 16,
            left: 16,
            backgroundColor: "#FF6B00",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
            zIndex: 99,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>
            [DEV] 좌표 시뮬
          </Text>
        </TouchableOpacity>
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
