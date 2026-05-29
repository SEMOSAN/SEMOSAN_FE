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
import { PinMarkerIcon } from "@/components/icons/pin-marker-icon";
import {
  COLLAPSED_PEEK_HEIGHT,
  Course,
  Difficulty,
  FLOATING_CARD_GAP,
  LOCATION_BUTTON_GAP,
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
// [DEMO] import { DEMO_NEARBY_DATA } from "@/features/tracking/constants/demo-gwanaksan";
import { useProfile } from "@/features/mypage/hooks/use-profile";
import { usePauseTrackingSession } from "@/features/tracking/hooks/use-pause-tracking-session";
import { useResumeTrackingSession } from "@/features/tracking/hooks/use-resume-tracking-session";
import { useSaveTrackingPhoto } from "@/features/tracking/hooks/use-save-tracking-photo";
import { useStartTrackingSession } from "@/features/tracking/hooks/use-start-tracking-session";
import { useSaveDifficultyFeedback } from "@/features/tracking/hooks/use-save-difficulty-feedback";
import { useTrackingFcm } from "@/features/tracking/hooks/use-tracking-fcm";
import {
  PhotoWindowPayload,
  useTrackingSocket,
} from "@/features/tracking/hooks/use-tracking-socket";
import { parseCoursePolyline } from "@/features/tracking/utils/parse-course-polyline";
import {
  setLocationTaskCallback,
  startLocationTask,
  stopLocationTask,
} from "@/features/tracking/tasks/location-task";
import { uploadTrackingPhoto } from "@/features/tracking/utils/upload-tracking-photo";
import { LiveActivity, addLiveActivityControlListener } from "@/modules/live-activity";
import { useLiveActivityCourse } from "@/features/tracking/hooks/use-live-activity-course";
import { calcCourseProgress } from "@/features/tracking/modules/course-progress";
import { useAppState } from "@/hooks/use-app-state";
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { useFocusEffect } from "@react-navigation/native";
import { Circle, Path, Svg } from "react-native-svg";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const DIFFICULTY_KO: Record<string, Difficulty> = {
  EASY: '초급',
  NORMAL: '중급',
  HARD: '고급',
};

export default function TrackingScreen() {
  const { collapse: collapseParameter, courseId: courseIdParameter, mountainId: mountainIdParameter } =
    useLocalSearchParams<{
      collapse?: string;
      courseId?: string;
      mountainId?: string;
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
  const [hikingRecordId, setHikingRecordId] = useState<number | null>(null);
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
  // 사용자 현재 위치 — useNearbyMountain API용 (실제 GPS에서만 업데이트)
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
    altitude: number | null;
  } | null>(null);
  // 현재 위치 마커 전용 — 시뮬/GPS 둘 다 업데이트 (잦은 리렌더 격리)
  const [markerCoord, setMarkerCoord] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // 자유기록 실시간 경로 누적 (회색 polyline)
  const [recordedCoords, setRecordedCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backgroundedAtRef = useRef<number | null>(null);
  const mapRef = useRef<NaverMapViewRef>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const isMountedRef = useRef(true);
  useEffect(() => () => { isMountedRef.current = false; }, []);

  useEffect(() => {
    if (courseIdParameter) setSelectedCourseId(courseIdParameter);
    if (collapseParameter !== undefined)
      setCollapsed(collapseParameter === "true");
  }, [courseIdParameter, collapseParameter]);

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
        setMarkerCoord({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.warn("[Location] 현재 위치 조회 실패:", error);
      }
    })();
  }, []);

  // [DEMO] 전시 데모용 관악산 좌표 고정 — 복원 시 아래 DEMO 줄 지우고 주석 해제
  // const { data: nearbyData, isLoading: isNearbyLoading } = useNearbyMountain({
  //   lat: userLocation?.latitude ?? null,
  //   lng: userLocation?.longitude ?? null,
  // });
  const { data: nearbyData, isLoading: isNearbyLoading } = useNearbyMountain({
    lat: 37.4449,  // [DEMO] 관악산 정상 위도
    lng: 126.9636, // [DEMO] 관악산 정상 경도
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
  const { mutate: saveDifficultyFeedback } = useSaveDifficultyFeedback();
  const { data: activeSession, refetch: refetchActiveSession } =
    useActiveTrackingSession();
  const { data: profile } = useProfile();

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
      // 코스 정보 복원
      if (activeSession.isFreeRecording) {
        setIsFreeMode(true);
      } else if (activeSession.courseId != null) {
        setSelectedCourseId(String(activeSession.courseId));
        setIsFreeMode(false);
      }
      connectSocket(activeSession.sessionId);
      // GPS 추적 재시작 — 백그라운드 포함
      const sid = activeSession.sessionId;
      setLocationTaskCallback(({ latitude, longitude, altitude, timestamp }) => {
        setUserLocation({ latitude, longitude, altitude });
        setMarkerCoord({ latitude, longitude });
        setRecordedCoords((prev) => [...prev, { latitude, longitude }]);
        publishGps(sid, {
          lat: latitude,
          lng: longitude,
          altitude,
          recordedAt: new Date(timestamp).toISOString(),
        });
      });
      startLocationTask().catch((err) => console.warn("[Location] 백그라운드 위치 재시작 실패:", err));
      setElapsedSeconds(0);
    }
  }, [activeSession]);

  const selectedCourseId_num = selectedCourseId
    ? Number(selectedCourseId)
    : null;
  const { data: courseDetail } = useCourseDetail(isFreeMode ? null : selectedCourseId_num);
  const { data: liveActivityCourse } = useLiveActivityCourse(isFreeMode ? null : selectedCourseId);
  const courseCoords = useMemo(
    () => parseCoursePolyline(courseDetail?.polyline),
    [courseDetail?.polyline],
  );

  // 마커 Y 비율: 0.0(바 상단/정상) ~ 1.0(바 하단/출발)
  // markerCoord 기준으로 코스에서 가장 가까운 좌표 인덱스를 찾아 정상까지의 진행률 계산
  const markerRatio = useMemo(() => {
    if (!markerCoord || courseCoords.length < 2) return 1.0;
    const summitIdx = Math.floor(courseCoords.length / 2);
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i <= summitIdx; i++) {
      const dLat = courseCoords[i].latitude - markerCoord.latitude;
      const dLng = courseCoords[i].longitude - markerCoord.longitude;
      const dist = dLat * dLat + dLng * dLng;
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }
    const progress = closestIdx / summitIdx; // 0.0(출발) ~ 1.0(정상)
    return 1.0 - progress; // 0.0(바 상단/정상) ~ 1.0(바 하단/출발)
  }, [markerCoord, courseCoords]);

  // altitudes 문자열에서 최고 고도(m) 파싱
  const peakAltitudeM = useMemo(() => {
    const raw = courseDetail?.altitudes;
    console.log('[Altitudes] raw type:', typeof raw, 'isArray:', Array.isArray(raw), 'value:', raw == null ? 'NULL' : String(raw).slice(0, 50));
    if (!raw) return null;
    try {
      const values: number[] = Array.isArray(raw)
        ? (raw as number[]).filter((n) => !isNaN(n) && n > 0)
        : String(raw).replace(/^\[|\]$/g, '').split(',').map(Number).filter((n) => !isNaN(n) && n > 0);
      console.log('[Altitudes] values.length:', values.length, 'max:', values.length > 0 ? Math.max(...values) : 'N/A');
      if (values.length > 0) return Math.round(Math.max(...values));
    } catch (e) {
      console.warn('[Altitudes] 파싱 실패:', e);
    }
    return null;
  }, [courseDetail?.altitudes]);

  // 정상/하산까지 시간·거리 — 코스 전체의 절반
  const halfDurationMinutes = Math.round((courseDetail?.duration ?? 0) / 2);
  const halfDistanceM = Math.round((courseDetail?.distance ?? 0) / 2);

  const selectedCourse = useMemo((): Course => ({
    id: String(courseDetail?.id ?? ''),
    name: courseDetail?.name ?? '',
    difficulty: DIFFICULTY_KO[courseDetail?.difficulty ?? ''] ?? '중급',
    altitudeNm: peakAltitudeM,
    distanceKm: Math.round((courseDetail?.distance ?? 0) / 100) / 10,
    summitDistanceM: halfDistanceM,
    descentDistanceM: halfDistanceM,
    durationHours: Math.floor((courseDetail?.duration ?? 0) / 60),
    durationMinutes: (courseDetail?.duration ?? 0) % 60,
    coordinates: [],
    centerLatitude: 0,
    centerLongitude: 0,
    zoom: 14,
  }), [courseDetail, peakAltitudeM, halfDistanceM]);

  const timeToTarget = halfDurationMinutes > 0
    ? `${Math.floor(halfDurationMinutes / 60) > 0 ? `${Math.floor(halfDurationMinutes / 60)}h ` : ''}${halfDurationMinutes % 60 > 0 ? `${halfDurationMinutes % 60}m` : ''}`
    : '-';
  const distanceToTarget = halfDistanceM >= 1000
    ? `${(halfDistanceM / 1000).toFixed(1)}km`
    : halfDistanceM > 0 ? `${halfDistanceM}m` : '-';

  // 정적 맵 오버레이 — markerCoord 변경 시 리렌더 방지
  const staticMapOverlays = useMemo(() => (
    <>
      {/* 코스 경로 — API polyline */}
      {courseCoords.length > 1 && (
        <>
          <NaverMapPathOverlay
            coords={courseCoords}
            width={6}
            color="#ffd40d"
            outlineWidth={1}
            outlineColor="#eab308"
          />
          <NaverMapMarkerOverlay
            latitude={courseCoords[0].latitude}
            longitude={courseCoords[0].longitude}
            width={34}
            height={45}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PinMarkerIcon fill="#507EF4" stroke="#2563EB" label="출발" />
          </NaverMapMarkerOverlay>
          <NaverMapMarkerOverlay
            latitude={courseCoords[courseCoords.length - 1].latitude}
            longitude={courseCoords[courseCoords.length - 1].longitude}
            width={34}
            height={45}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PinMarkerIcon fill="#FF5249" stroke="#DC2626" label="도착" />
          </NaverMapMarkerOverlay>
          {/* 정상 마커 — 코스 거리의 1/2 지점 */}
          <NaverMapMarkerOverlay
            latitude={courseCoords[Math.floor(courseCoords.length / 2)].latitude}
            longitude={courseCoords[Math.floor(courseCoords.length / 2)].longitude}
            width={34}
            height={45}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PinMarkerIcon fill="#00D864" stroke="#16A34A" label="정상" />
          </NaverMapMarkerOverlay>
        </>
      )}

      {/* 자유기록 실시간 경로 — 회색 polyline + 출발/도착 마커 */}
      {isFreeMode && recordedCoords.length > 0 && (
        <>
          {recordedCoords.length > 1 && (
            <NaverMapPathOverlay
              coords={recordedCoords}
              width={6}
              color="#9CA3AF"
              outlineWidth={1}
              outlineColor="#6B7280"
            />
          )}
          <NaverMapMarkerOverlay
            latitude={recordedCoords[0].latitude}
            longitude={recordedCoords[0].longitude}
            width={34}
            height={45}
            anchor={{ x: 0.5, y: 1 }}
          >
            <PinMarkerIcon fill="#507EF4" stroke="#2563EB" label="출발" />
          </NaverMapMarkerOverlay>
          {/* 도착 마커 — 트래킹 종료 후에만 표시 */}
          {!isTracking && recordedCoords.length > 1 && (
            <NaverMapMarkerOverlay
              latitude={recordedCoords[recordedCoords.length - 1].latitude}
              longitude={recordedCoords[recordedCoords.length - 1].longitude}
              width={34}
              height={45}
              anchor={{ x: 0.5, y: 1 }}
            >
              <PinMarkerIcon fill="#FF5249" stroke="#DC2626" label="도착" />
            </NaverMapMarkerOverlay>
          )}
          {/* 자유기록 정상 마커 — nearbyData 산 좌표 사용 */}
          {nearbyData?.mountain?.latitude != null && nearbyData.mountain.longitude != null && (
            <NaverMapMarkerOverlay
              latitude={nearbyData.mountain.latitude}
              longitude={nearbyData.mountain.longitude}
              width={34}
              height={45}
              anchor={{ x: 0.5, y: 1 }}
            >
              <PinMarkerIcon fill="#00D864" stroke="#16A34A" label="정상" />
            </NaverMapMarkerOverlay>
          )}
        </>
      )}
    </>
  ), [courseCoords, isFreeMode, recordedCoords, isTracking, nearbyData]);

  // [DEV] 코스 좌표를 빠르게 publish — 백엔드 마일스톤 트리거 테스트용
  const startCoordSimulation = useCallback(() => {
    if (!sessionId) return;
    if (simIntervalRef.current) {
      console.warn('[SIM] 이미 실행 중');
      return;
    }
    const coords = courseCoords;
    if (coords.length === 0) {
      console.warn('[SIM] 코스 좌표 없음');
      return;
    }

    // [DEMO] 즉시 출발지 마커 세팅 (실제 GPS가 덮기 전에)
    setMarkerCoord({ latitude: coords[0].latitude, longitude: coords[0].longitude });

    let idx = 0;
    console.log(`[SIM] 시작 — 총 ${coords.length}개 좌표`);
    simIntervalRef.current = setInterval(() => {
      if (idx >= coords.length) {
        clearInterval(simIntervalRef.current!);
        simIntervalRef.current = null;
        console.log('[SIM] 완료');
        return;
      }
      const { latitude, longitude } = coords[idx];
      publishGps(sessionId, {
        lat: latitude,
        lng: longitude,
        altitude: 0,
        recordedAt: new Date().toISOString(),
      });
      setMarkerCoord({ latitude, longitude });
      idx++;
    }, 50);
  }, [sessionId, courseCoords, publishGps]);

  // [DEMO] 트래킹 시작 + 코스 좌표 준비 시 자동 시뮬레이션 시작 (자유기록 제외)
  useEffect(() => {
    if (!isTracking || isFreeMode) return;
    if (!sessionId || courseCoords.length === 0) return;
    if (simIntervalRef.current) return; // 이미 실행 중
    // 실제 GPS 콜백이 시뮬 마커를 덮어쓰지 않도록 먼저 해제
    setLocationTaskCallback(null);
    startCoordSimulation();
  }, [isTracking, isFreeMode, sessionId, courseCoords.length]);

  // polyline 로드되거나 트래킹 시작 시 카메라를 전체 경로가 보이도록 맞춤
  useEffect(() => {
    if (courseCoords.length < 2) return;
    const lats = courseCoords.map((c) => c.latitude);
    const lngs = courseCoords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 0.15;
    const fit = () =>
      mapRef.current?.animateCameraWithTwoCoords({
        coord1: {
          latitude: minLat - (maxLat - minLat) * padding,
          longitude: minLng - (maxLng - minLng) * padding,
        },
        coord2: {
          latitude: maxLat + (maxLat - minLat) * padding,
          longitude: maxLng + (maxLng - minLng) * padding,
        },
        duration: 500,
      });
    // mapRef가 아직 마운트 전일 수 있으니 약간 지연
    const timer = setTimeout(fit, 300);
    return () => clearTimeout(timer);
  }, [courseDetail?.polyline, isTracking]);

  // 트래킹 시작/종료 시 follow 모드 토글
  useEffect(() => {
    setIsFollowingUser(isTracking);
  }, [isTracking]);

  // 트래킹 중 실시간 위치 마커 카메라 추적 (사용자가 직접 조작하면 follow 해제)
  useEffect(() => {
    if (!isFollowingUser || !markerCoord) return;
    mapRef.current?.animateCameraTo({
      latitude: markerCoord.latitude,
      longitude: markerCoord.longitude,
      zoom: 15,
      duration: 800,
    });
  }, [markerCoord, isFollowingUser]);

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
      // mountainId 우선순위: URL 파라미터(코스 상세에서 진입) > nearbyData(현재 위치 기반)
      const mountainId = mountainIdParameter ? Number(mountainIdParameter) : nearbyData?.mountain?.mountainId;
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
              if (!isMountedRef.current) return;
              if (data.sessionId != null) {
                const sid = data.sessionId;
                setSessionId(sid);
                // 세션 ID 확정 후 웹소켓 연결 및 photo-window 구독
                connectSocket(sid);
                // GPS 추적 시작 — 백그라운드 포함
                setRecordedCoords([]);
                setLocationTaskCallback(({ latitude, longitude, altitude, timestamp }) => {
                  setUserLocation({ latitude, longitude, altitude });
                  setMarkerCoord({ latitude, longitude });
                  setRecordedCoords((prev) => [...prev, { latitude, longitude }]);
                  publishGps(sid, {
                    lat: latitude,
                    lng: longitude,
                    altitude,
                    recordedAt: new Date(timestamp).toISOString(),
                  });
                });
                startLocationTask().catch((err) => {
                  console.warn("[Location] 백그라운드 위치 시작 실패:", err);
                });
              }
            },
            onError: (err: any) => {
              if (!isMountedRef.current) return;
              console.warn(
                "[Tracking] 세션 시작 실패:",
                err?.response?.data ?? err?.message ?? err,
              );
              // API 실패 시 트래킹 상태 롤백
              setIsTracking(false);
              setIsFreeMode(false);
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
        const totalMeters = liveActivityCourse?.totalDistance
          ?? Math.round(selectedCourse.distanceKm * 1000);
        const totalMinutes = liveActivityCourse?.estimatedTime
          ?? (selectedCourse.durationHours * 60 + selectedCourse.durationMinutes);
        LiveActivity.start({
          mode: "course",
          remainingMinutes: totalMinutes,
          remainingMeters: Math.round(totalMeters),
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
        let progress = 0;
        let remainingMeters = 0;
        let remainingMinutes = 0;

        if (liveActivityCourse && userLocation) {
          const result = calcCourseProgress(
            userLocation,
            liveActivityCourse.coordinates,
            liveActivityCourse.totalDistance
          );
          progress = result.progress;
          remainingMeters = Math.round(result.remainingMeters);
          remainingMinutes = Math.ceil(liveActivityCourse.estimatedTime * (1 - progress));
        } else {
          const totalSeconds =
            (selectedCourse.durationHours * 60 + selectedCourse.durationMinutes) * 60;
          const totalMeters = Math.round(selectedCourse.distanceKm * 1000);
          progress = totalSeconds > 0 ? Math.min(elapsedSeconds / totalSeconds, 1) : 0;
          remainingMinutes = Math.ceil(Math.max(0, totalSeconds - elapsedSeconds) / 60);
          remainingMeters = Math.round(totalMeters * (1 - progress));
        }

        LiveActivity.update({
          elapsedSeconds,
          isRunning: !isPaused,
          mode: "course",
          remainingMinutes,
          remainingMeters,
          progress,
        }).catch(() => {});
      }
    }
  }, [elapsedSeconds, isPaused, isFreeMode, selectedCourse, liveActivityCourse, userLocation]);

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

  // Live Activity 버튼(pause/resume) → 앱 동기화
  // refs로 항상 최신 함수를 참조 (리스너는 isTracking 변경 시에만 재등록)
  const pauseTrackingRef = useRef(pauseTracking);
  pauseTrackingRef.current = pauseTracking;
  const resumeTrackingRef = useRef(resumeTracking);
  resumeTrackingRef.current = resumeTracking;

  useEffect(() => {
    if (!isLiveActivityEnabled || !isTracking) return;
    const sub = addLiveActivityControlListener((action) => {
      if (action === 'pause') pauseTrackingRef.current();
      else resumeTrackingRef.current();
    });
    return () => sub.remove();
  }, [isTracking]);

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
        onSuccess: (data) => {
          if (data.hikingRecordId != null) setHikingRecordId(data.hikingRecordId);
        },
        onError: (err) => console.warn("[Tracking] 세션 종료 실패:", err),
      });
    }
    setShowDifficultyRating(true);
  };

  const DIFFICULTY_COMPARISON = {
    similar: 'SIMILAR',
    easier: 'EASIER',
    harder: 'HARDER',
  } as const;

  /** 난이도 체감 완료 후 피드백 저장 + 상태 초기화 */
  const completeTracking = (option: 'similar' | 'easier' | 'harder' | null) => {
    if (hikingRecordId != null && option != null) {
      saveDifficultyFeedback(
        { hikingRecordId, comparison: DIFFICULTY_COMPARISON[option] },
        { onError: (err) => console.warn("[Tracking] 난이도 피드백 저장 실패:", err) },
      );
    }
    if (isLiveActivityEnabled) LiveActivity.stop().catch(() => {});
    stopLocationTask().catch(() => {});
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
    setHikingRecordId(null);
    setPhotoWindow(null);
    setCollapsed(false);
    setRecordedCoords([]);
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
          onCameraChanged={({ reason }) => {
            if (reason === 'Gesture') setIsFollowingUser(false);
          }}
        >
          {staticMapOverlays}

          {/* 현재 사용자 위치 마커 — 삼각형(11×9) + 원(28×28), 삼각형이 원 위에 겹침 */}
          {markerCoord && isTracking && (
            <NaverMapMarkerOverlay
              latitude={markerCoord.latitude}
              longitude={markerCoord.longitude}
              width={28}
              height={34}
              anchor={{ x: 0.5, y: 0.47 }}
              onTap={() => setIsFollowingUser(true)}
            >
              {/* 총 높이: 삼각형 9 + 원 28 - 겹침 3 = 34 */}
              <View collapsable={false} style={{ width: 28, height: 34 }}>
                {/* 원 SVG — top: 6 (삼각형 9 - 겹침 3) */}
                <Svg width={28} height={28} viewBox="0 0 28 28" fill="none" style={{ position: 'absolute', top: 6, left: 0 }}>
                  <Circle cx={14} cy={10} r={7} fill="#00D864" />
                  <Circle cx={14} cy={10} r={8.5} stroke="white" strokeWidth={3} />
                </Svg>
                {/* 삼각형 SVG — top: 0, 가로 중앙 */}
                <Svg width={11} height={9} viewBox="0 0 11 9" fill="none" style={{ position: 'absolute', top: 0, left: (28 - 11) / 2 }}>
                  <Path
                    d="M4.28833 0.918945C4.68715 0.360597 5.51646 0.360596 5.91528 0.918945L9.51685 5.95996L9.5686 6.04004C9.80428 6.44189 9.70042 6.89069 9.48657 7.18262C9.25971 7.49219 8.83304 7.73339 8.34985 7.60645C7.44144 7.36779 6.26488 7.13965 5.10181 7.13965C3.93873 7.13965 2.76217 7.36779 1.85376 7.60645C1.37058 7.73339 0.943901 7.49219 0.717041 7.18262C0.488937 6.87123 0.386039 6.38098 0.686768 5.95996L4.28833 0.918945Z"
                    fill="#00D864"
                    stroke="white"
                  />
                </Svg>
              </View>
            </NaverMapMarkerOverlay>
          )}
        </NaverMapView>

        {/* 사진 윈도우 배너 — 지도 위 오버레이 */}
        {isTracking && photoWindow?.status === 'OPEN' && (
          <View style={{ position: 'absolute', top: 124, left: 0, right: 0, alignItems: 'center', zIndex: 10 }}>
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
                imageSource={profile?.profileUrl ? { uri: profile.profileUrl } : undefined}
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
        onPress={() => {
          const coord = markerCoord ?? userLocation;
          if (coord) {
            mapRef.current?.animateCameraTo({
              latitude: coord.latitude,
              longitude: coord.longitude,
              zoom: 15,
            });
          }
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
          onCollapse={() => setCollapsed(true)}
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
              isPhotoWindowOpen={photoWindow?.status === "OPEN" || hasSummited}
              hasSummited={hasSummited}
              timeToTarget={timeToTarget}
              distanceToTarget={distanceToTarget}
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
        mountainName={nearbyData?.mountain?.name ?? ""}
        onClose={() => completeTracking(null)}
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
