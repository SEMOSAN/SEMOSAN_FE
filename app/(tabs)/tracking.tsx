import { LocationIcon } from "@/components/icons/location-icon";
import { PinMarkerIcon } from "@/components/icons/pin-marker-icon";
import { isLiveActivityEnabled } from "@/constants/platform";
import { useProfile } from "@/features/mypage/hooks/use-profile";
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
import {
  COLLAPSED_PEEK_HEIGHT,
  Course,
  Difficulty,
  FLOATING_CARD_GAP,
  LOCATION_BUTTON_GAP,
  SHADOW,
  TRACKING_COURSE_CARD_TOP,
  TRACKING_SHEET_HEIGHT,
} from "@/features/tracking/constants";
import { useActiveTrackingSession } from "@/features/tracking/hooks/use-active-tracking-session";
import { useCompleteTrackingSession } from "@/features/tracking/hooks/use-complete-tracking-session";
import { useCourseDetail } from "@/features/tracking/hooks/use-course-detail";
import { useLiveActivityCourse } from "@/features/tracking/hooks/use-live-activity-course";
import { useNearbyMountain } from "@/features/tracking/hooks/use-nearby-mountain";
import { usePauseTrackingSession } from "@/features/tracking/hooks/use-pause-tracking-session";
import { useResumeTrackingSession } from "@/features/tracking/hooks/use-resume-tracking-session";
import { useSaveDifficultyFeedback } from "@/features/tracking/hooks/use-save-difficulty-feedback";
import { useSaveTrackingPhoto } from "@/features/tracking/hooks/use-save-tracking-photo";
import { useStartTrackingSession } from "@/features/tracking/hooks/use-start-tracking-session";
import { useTrackingFcm } from "@/features/tracking/hooks/use-tracking-fcm";
import {
  PhotoWindowPayload,
  useTrackingSocket,
} from "@/features/tracking/hooks/use-tracking-socket";
import { calcCourseProgress } from "@/features/tracking/modules/course-progress";
import {
  setLocationTaskCallback,
  startLocationTask,
  stopLocationTask,
} from "@/features/tracking/tasks/location-task";
import {
  parseCoursePolyline,
  smoothCourseCoords,
} from "@/features/tracking/utils/parse-course-polyline";
import { uploadTrackingPhoto } from "@/features/tracking/utils/upload-tracking-photo";
import { useAppState } from "@/hooks/use-app-state";
import {
  LiveActivity,
  addLiveActivityControlListener,
} from "@/modules/live-activity";
import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import { useFocusEffect } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Tabs, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Circle, Path, Svg } from "react-native-svg";

const DIFFICULTY_KO: Record<string, Difficulty> = {
  EASY: "초급",
  NORMAL: "중급",
  HARD: "고급",
};

const { colors } = require("../../tokens.cjs") as {
  colors: Record<string, Record<string, string>>;
};
const COLOR_WHITE = colors.common["100"]; // #ffffff

// 경사 등급별 polyline 색상 (outline은 디자인 토큰 common-100 사용)
const SEGMENT_COLORS: Record<string, { color: string }> = {
  STEEP_DOWN: { color: "#2563EB" },
  MILD_DOWN: { color: "#93C5FD" },
  FLAT: { color: "#FFD40D" },
  MILD_UP: { color: "#FF8C49" },
  STEEP_UP: { color: "#DC2626" },
};

// 좌표 개수가 MIN_SEGMENT_COORDS 미만인 짧은 세그먼트를 앞 세그먼트에 흡수해 색 전환 빈도를 줄임
const MIN_SEGMENT_COORDS = 8;

// GPS 튐(outlier) 좌표 필터링 기준 — 누적 경로가 삐죽하게 그려지는 문제 방지
const MAX_LOCATION_ACCURACY_M = 30; // 정확도(m)가 이보다 나쁘면서 크게 튄 좌표는 버림
const MIN_JUMP_M = 20; // 이보다 작은 이동은 속도 판정에서 제외 (정지 시 노이즈)
const MAX_SPEED_MPS = 30; // 이보다 빠른 이동(≈108km/h)은 비현실적 → 튐 좌표로 간주

// 두 좌표 간 거리(m) — Haversine
function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function mergeShortSegments(
  segments: { startIdx: number; endIdx: number; grade: string }[],
): { startIdx: number; endIdx: number; grade: string }[] {
  return segments.reduce<{ startIdx: number; endIdx: number; grade: string }[]>(
    (acc, seg) => {
      const len = seg.endIdx - seg.startIdx + 1;
      const last = acc[acc.length - 1];
      if (last && len < MIN_SEGMENT_COORDS) {
        last.endIdx = seg.endIdx;
      } else {
        acc.push({ ...seg });
      }
      return acc;
    },
    [],
  );
}

export default function TrackingScreen() {
  const {
    collapse: collapseParameter,
    courseId: courseIdParameter,
    mountainId: mountainIdParameter,
  } = useLocalSearchParams<{
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
  // 정상 인증 시점의 photoWindow 저장 — 인증 후 photoWindow가 닫혀도 메타 업로드에 사용
  const summitPhotoWindowRef = useRef<PhotoWindowPayload | null>(null);
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
  const [recordedCoords, setRecordedCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const backgroundedAtRef = useRef<number | null>(null);
  // 위치 업데이트 중복 방지 — foreground watch + background task 동시 수신 대비
  const lastLocationTsRef = useRef(0);
  // 직전에 채택된 좌표 — GPS 튐 좌표 필터링용 (누적 경로 왜곡 방지)
  const lastAcceptedCoordRef = useRef<{
    latitude: number;
    longitude: number;
    timestamp: number;
  } | null>(null);
  const mapRef = useRef<NaverMapViewRef>(null);
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const isMountedRef = useRef(true);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

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

  // sessionId를 ref로 미러링 — 위치 콜백에서 항상 최신 값 참조
  const sessionIdRef = useRef<number | null>(null);
  sessionIdRef.current = sessionId;

  // 포어그라운드 watch + 백그라운드 task 공용 위치 업데이트 핸들러
  // 동일/과거 타임스탬프는 무시해 두 소스 동시 수신 시 좌표·publish 중복 방지
  const handleLocationUpdate = useCallback(
    (loc: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy?: number | null;
      timestamp: number;
    }) => {
      if (loc.timestamp && loc.timestamp <= lastLocationTsRef.current) return;
      lastLocationTsRef.current = loc.timestamp || Date.now();

      const { latitude, longitude, altitude, accuracy, timestamp } = loc;

      // GPS 튐 좌표 제거 — 직전 채택 좌표 대비 비현실적 점프/저정확도 좌표는 버림
      const last = lastAcceptedCoordRef.current;
      if (last) {
        const dist = haversineMeters(last, { latitude, longitude });
        const dtSec = (timestamp - last.timestamp) / 1000;
        const speed = dtSec > 0 ? dist / dtSec : 0;
        const inaccurateJump =
          accuracy != null &&
          accuracy > MAX_LOCATION_ACCURACY_M &&
          dist > MAX_LOCATION_ACCURACY_M;
        const teleport = dist > MIN_JUMP_M && speed > MAX_SPEED_MPS;
        // 마커·경로·publish 모두 스킵 (다음 좌표는 마지막 정상 좌표 기준으로 재판정)
        if (inaccurateJump || teleport) return;
      }
      lastAcceptedCoordRef.current = { latitude, longitude, timestamp };

      setUserLocation({ latitude, longitude, altitude });
      setMarkerCoord({ latitude, longitude });
      setRecordedCoords((prev) => [...prev, { latitude, longitude }]);

      const sid = sessionIdRef.current;
      if (sid != null) {
        publishGps(sid, {
          lat: latitude,
          lng: longitude,
          altitude,
          recordedAt: new Date(timestamp).toISOString(),
        });
      }
    },
    [publishGps],
  );

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
      sessionIdRef.current = activeSession.sessionId;
      lastLocationTsRef.current = 0;
      lastAcceptedCoordRef.current = null;
      setLocationTaskCallback(handleLocationUpdate);
      startLocationTask().catch((err) =>
        console.warn("[Location] 백그라운드 위치 재시작 실패:", err),
      );
      // 강제 종료 후 재진입 시 경과 시간을 서버 기준으로 복원 (0으로 초기화 방지)
      // 등산 시간 = (기준 시각 - 시작 시각) - 누적 일시정지 시간
      //   IN_PROGRESS: 기준 시각 = 현재, PAUSED: 기준 시각 = 일시정지 시각(시간 정지)
      setElapsedSeconds(() => {
        const startedMs = activeSession.startedAt
          ? new Date(activeSession.startedAt).getTime()
          : NaN;
        if (Number.isNaN(startedMs)) return 0;
        const pausedTotal = activeSession.pausedSecondsTotal ?? 0;
        const refMs =
          status === "PAUSED" && activeSession.pausedAt
            ? new Date(activeSession.pausedAt).getTime()
            : Date.now();
        if (Number.isNaN(refMs)) return 0;
        return Math.max(
          0,
          Math.floor((refMs - startedMs) / 1000) - pausedTotal,
        );
      });
    }
  }, [activeSession]);

  const selectedCourseId_num = selectedCourseId
    ? Number(selectedCourseId)
    : null;
  const { data: courseDetail } = useCourseDetail(
    isFreeMode ? null : selectedCourseId_num,
  );
  const { data: liveActivityCourse } = useLiveActivityCourse(
    isFreeMode ? null : selectedCourseId,
  );
  const courseCoords = useMemo(
    () => smoothCourseCoords(parseCoursePolyline(courseDetail?.polyline)),
    [courseDetail?.polyline],
  );

  // 정상/하산까지 시간·거리 — 코스 전체의 절반 (courseProgressState useMemo보다 먼저 선언)
  const halfDurationMinutes = Math.round((courseDetail?.duration ?? 0) / 2);
  const halfDistanceM = Math.round((courseDetail?.distance ?? 0) / 2);

  // 코스 진행 상태 — GPS 기반 실시간 (markerRatio + 남은 거리/시간 통합)
  const courseProgressState = useMemo(() => {
    // ── 1순위: liveActivityCourse + Haversine 실측 거리 계산 ──────────────
    if (
      liveActivityCourse &&
      userLocation &&
      liveActivityCourse.totalDistance > 0
    ) {
      const result = calcCourseProgress(
        userLocation,
        liveActivityCourse.coordinates,
        liveActivityCourse.totalDistance,
      );
      // 분/m 페이스 (전체 코스 기준 일정 속도 가정)
      const paceMinPerM =
        liveActivityCourse.estimatedTime / liveActivityCourse.totalDistance;
      const traveledM =
        liveActivityCourse.totalDistance - result.remainingMeters;

      if (hasSummited) {
        // 하산 중: 코스 끝까지 남은 거리/시간
        return {
          markerRatio: 0.0,
          remainingDistanceM: Math.round(result.remainingMeters),
          remainingDurationMin: Math.round(
            result.remainingMeters * paceMinPerM,
          ),
        };
      }

      // 등산 중: 코스 중간(정상)까지 남은 거리/시간
      const halfDistance = liveActivityCourse.totalDistance / 2;
      const remainingToSummitM = Math.max(0, halfDistance - traveledM);
      const ascProgress = Math.min(traveledM / halfDistance, 1); // 0(출발) ~ 1(정상)
      return {
        markerRatio: Math.max(0, 1.0 - ascProgress), // 1.0(바 하단/출발) ~ 0.0(바 상단/정상)
        remainingDistanceM: Math.round(remainingToSummitM),
        remainingDurationMin: Math.round(remainingToSummitM * paceMinPerM),
      };
    }

    // ── 2순위 폴백: 인덱스 기반 선형 보간 (liveActivityCourse 로딩 전) ──
    const summitIdx = Math.floor(courseCoords.length / 2);
    const totalIdx = courseCoords.length - 1;

    if (hasSummited) {
      if (!markerCoord || courseCoords.length < 2) {
        return {
          markerRatio: 0.0,
          remainingDistanceM: halfDistanceM,
          remainingDurationMin: halfDurationMinutes,
        };
      }
      let closestIdx = summitIdx;
      let minDist = Infinity;
      for (let i = summitIdx; i <= totalIdx; i++) {
        const dLat = courseCoords[i].latitude - markerCoord.latitude;
        const dLng = courseCoords[i].longitude - markerCoord.longitude;
        const dist = dLat * dLat + dLng * dLng;
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }
      const descentTotal = totalIdx - summitIdx;
      const ratio =
        descentTotal > 0
          ? Math.max(
              0,
              Math.min(1, 1 - (closestIdx - summitIdx) / descentTotal),
            )
          : 0;
      return {
        markerRatio: 0.0,
        remainingDistanceM: Math.round(halfDistanceM * ratio),
        remainingDurationMin: Math.round(halfDurationMinutes * ratio),
      };
    }

    if (!markerCoord || courseCoords.length < 2) {
      return {
        markerRatio: 1.0,
        remainingDistanceM: halfDistanceM,
        remainingDurationMin: halfDurationMinutes,
      };
    }

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
    const progress = summitIdx > 0 ? closestIdx / summitIdx : 0;
    const remaining = Math.max(0, 1 - progress);
    return {
      markerRatio: 1.0 - progress,
      remainingDistanceM: Math.round(halfDistanceM * remaining),
      remainingDurationMin: Math.round(halfDurationMinutes * remaining),
    };
  }, [
    markerCoord,
    courseCoords,
    hasSummited,
    halfDistanceM,
    halfDurationMinutes,
    liveActivityCourse,
    userLocation,
  ]);

  const { markerRatio, remainingDistanceM, remainingDurationMin } =
    courseProgressState;

  // 줌 레벨에 따른 폴리라인 두께 — 줌아웃 시 얇게, 줌인 시 두껍게
  const polylineWidth = { colored: 6, base: 10 };

  // altitudes 문자열에서 최고 고도(m) 파싱
  const peakAltitudeM = useMemo(() => {
    const raw = courseDetail?.altitudes;
    console.log(
      "[Altitudes] raw type:",
      typeof raw,
      "isArray:",
      Array.isArray(raw),
      "value:",
      raw == null ? "NULL" : String(raw).slice(0, 50),
    );
    if (!raw) return null;
    try {
      const values: number[] = Array.isArray(raw)
        ? (raw as number[]).filter((n) => !isNaN(n) && n > 0)
        : String(raw)
            .replace(/^\[|\]$/g, "")
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n) && n > 0);
      console.log(
        "[Altitudes] values.length:",
        values.length,
        "max:",
        values.length > 0 ? Math.max(...values) : "N/A",
      );
      if (values.length > 0) return Math.round(Math.max(...values));
    } catch (e) {
      console.warn("[Altitudes] 파싱 실패:", e);
    }
    return null;
  }, [courseDetail?.altitudes]);

  const selectedCourse = useMemo(
    (): Course => ({
      id: String(courseDetail?.id ?? ""),
      name: courseDetail?.name ?? "",
      difficulty: DIFFICULTY_KO[courseDetail?.difficulty ?? ""] ?? "중급",
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
    }),
    [courseDetail, peakAltitudeM, halfDistanceM],
  );

  const timeToTarget = (() => {
    if (remainingDurationMin <= 0) return "-";
    const h = Math.floor(remainingDurationMin / 60);
    const m = remainingDurationMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  })();
  const distanceToTarget =
    remainingDistanceM >= 1000
      ? `${(remainingDistanceM / 1000).toFixed(1)}km`
      : remainingDistanceM > 0
        ? `${remainingDistanceM}m`
        : "-";

  // 정적 맵 오버레이 — markerCoord 변경 시 리렌더 방지
  const staticMapOverlays = useMemo(
    () => (
      <>
        {/* 코스 경로 — segments 경사 등급별 색상 / 없으면 단일 노란 polyline */}
        {courseCoords.length > 1 && (
          <>
            {courseDetail?.segments?.length ? (
              <>
                {/* 흰색 베이스 — 가장자리 border 역할 */}
                <NaverMapPathOverlay
                  coords={courseCoords}
                  width={polylineWidth.base}
                  color={COLOR_WHITE}
                  outlineWidth={1}
                  outlineColor={COLOR_WHITE}
                />
                {/* 컬러 segments — 베이스 위에 얹어서 가장자리만 흰색으로 보임 */}
                {mergeShortSegments(courseDetail.segments).map((seg, i) => {
                  const coords = courseCoords.slice(
                    seg.startIdx,
                    seg.endIdx + 1,
                  );
                  if (coords.length < 2) return null;
                  const { color } =
                    SEGMENT_COLORS[seg.grade] ?? SEGMENT_COLORS.FLAT;
                  return (
                    <NaverMapPathOverlay
                      key={i}
                      coords={coords}
                      width={polylineWidth.colored}
                      color={color}
                      outlineWidth={1}
                      outlineColor={color}
                    />
                  );
                })}
              </>
            ) : (
              <>
                <NaverMapPathOverlay
                  coords={courseCoords}
                  width={polylineWidth.base}
                  color={COLOR_WHITE}
                  outlineWidth={1}
                  outlineColor={COLOR_WHITE}
                />
                <NaverMapPathOverlay
                  coords={courseCoords}
                  width={polylineWidth.colored}
                  color="#FFD40D"
                  outlineWidth={1}
                  outlineColor="#FFD40D"
                />
              </>
            )}
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
              latitude={
                courseCoords[Math.floor(courseCoords.length / 2)].latitude
              }
              longitude={
                courseCoords[Math.floor(courseCoords.length / 2)].longitude
              }
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
          </>
        )}
      </>
    ),
    [
      courseCoords,
      courseDetail?.segments,
      isFreeMode,
      recordedCoords,
      isTracking,
      nearbyData,
    ],
  );

  // [DEV] 코스 좌표를 빠르게 publish — 백엔드 마일스톤 트리거 테스트용

  // 트래킹 시작 전, polyline 로드 시 전체 경로가 보이도록 카메라 맞춤 (코스 미리보기)
  // 트래킹 중에는 현위치 follow가 카메라를 담당하므로 전체 맞춤을 하지 않음
  useEffect(() => {
    if (isTracking) return;
    if (courseCoords.length < 2) return;

    const timer = setTimeout(() => {
      const lats = courseCoords.map((c) => c.latitude);
      const lngs = courseCoords.map((c) => c.longitude);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const padding = 0.15;
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
    }, 300);
    return () => clearTimeout(timer);
  }, [courseDetail?.polyline, isTracking]);

  // 트래킹 시작/종료 시 follow 모드 토글
  // 트래킹 중(코스·자유기록 공통): 현위치가 지도 중앙에 오도록 follow 활성
  // (사용자가 직접 지도를 조작하면 onCameraChanged에서 follow 해제)
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

  // 포어그라운드 실시간 위치 추적 — 앱이 열려 있는 동안 마커/경로 갱신을 담당.
  // 백그라운드 task는 "항상" 위치 권한이 있어야 시작되므로, 권한을 "앱 사용 중"만
  // 허용한 경우 마커가 갱신되지 않던 문제를 해결한다. (화면이 꺼졌을 때는 백그라운드 task가 담당)
  useEffect(() => {
    if (!isTracking) return;
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") return;
        sub = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 2000,
            distanceInterval: 5,
          },
          (loc) =>
            handleLocationUpdate({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
              altitude: loc.coords.altitude,
              accuracy: loc.coords.accuracy,
              timestamp: loc.timestamp,
            }),
        );
        // await 도중 언마운트/트래킹 종료된 경우 즉시 해제
        if (cancelled) {
          sub.remove();
          sub = null;
        }
      } catch (err) {
        console.warn("[Location] 포어그라운드 위치 추적 실패:", err);
      }
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [isTracking, handleLocationUpdate]);

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
      const mountainId = mountainIdParameter
        ? Number(mountainIdParameter)
        : nearbyData?.mountain?.mountainId;
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
                sessionIdRef.current = sid;
                // 세션 ID 확정 후 웹소켓 연결 및 photo-window 구독
                connectSocket(sid);
                // GPS 추적 시작 — 백그라운드 포함
                setRecordedCoords([]);
                lastLocationTsRef.current = 0;
                lastAcceptedCoordRef.current = null;
                setLocationTaskCallback(handleLocationUpdate);
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
              Sentry.captureException(new Error("TrackingSessionStartFailed"));
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
        LiveActivity.start({ mode: "free" }).catch((e: unknown) => {
          console.warn("[LiveActivity] start(free) 실패:", e);
        });
      } else {
        const totalMeters =
          liveActivityCourse?.totalDistance ??
          Math.round(selectedCourse.distanceKm * 1000);
        const totalMinutes =
          liveActivityCourse?.estimatedTime ??
          selectedCourse.durationHours * 60 + selectedCourse.durationMinutes;
        LiveActivity.start({
          mode: "course",
          remainingMinutes: totalMinutes,
          remainingMeters: Math.round(totalMeters),
          progress: 0,
        }).catch((e: unknown) => {
          console.warn("[LiveActivity] start(course) 실패:", e);
        });
      }
    } else {
      console.warn(
        "[LiveActivity] isLiveActivityEnabled=false — 환경변수 확인 필요",
      );
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTracking, isFreeMode]);

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
      // 실행 중일 때 가상 시작 시각 계산 (위젯 네이티브 타이머용)
      const timerStartEpoch = !isPaused
        ? Date.now() - elapsedSeconds * 1000
        : undefined;

      if (isFreeMode) {
        LiveActivity.update({
          elapsedSeconds,
          isRunning: !isPaused,
          mode: "free",
          timerStartEpoch,
        }).catch(() => {});
      } else {
        let progress = 0;
        let remainingMeters = 0;
        let remainingMinutes = 0;

        if (liveActivityCourse && userLocation) {
          const result = calcCourseProgress(
            userLocation,
            liveActivityCourse.coordinates,
            liveActivityCourse.totalDistance,
          );
          progress = result.progress;
          remainingMeters = Math.round(result.remainingMeters);
          remainingMinutes = Math.ceil(
            liveActivityCourse.estimatedTime * (1 - progress),
          );
        } else {
          const totalSeconds =
            (selectedCourse.durationHours * 60 +
              selectedCourse.durationMinutes) *
            60;
          const totalMeters = Math.round(selectedCourse.distanceKm * 1000);
          progress =
            totalSeconds > 0 ? Math.min(elapsedSeconds / totalSeconds, 1) : 0;
          remainingMinutes = Math.ceil(
            Math.max(0, totalSeconds - elapsedSeconds) / 60,
          );
          remainingMeters = Math.round(totalMeters * (1 - progress));
        }

        LiveActivity.update({
          elapsedSeconds,
          isRunning: !isPaused,
          mode: "course",
          timerStartEpoch,
          remainingMinutes,
          remainingMeters,
          progress,
        }).catch(() => {});
      }
    }
  }, [
    elapsedSeconds,
    isPaused,
    isFreeMode,
    selectedCourse,
    liveActivityCourse,
    userLocation,
  ]);

  const pauseTracking = () => {
    setIsPaused(true);
    if (sessionId != null) {
      pauseSession(sessionId, {
        onError: (err) => {
          console.warn("[Tracking] 일시정지 실패:", err);
          Sentry.captureException(new Error("TrackingSessionPauseFailed"));
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
          Sentry.captureException(new Error("TrackingSessionResumeFailed"));
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
      if (action === "pause") pauseTrackingRef.current();
      else resumeTrackingRef.current();
    });
    return () => sub.remove();
  }, [isTracking]);

  useEffect(() => {
    if (!isLiveActivityEnabled || !isTracking) return;
    const handleURL = ({ url }: { url: string }) => {
      try {
        const action = new URL(url).searchParams.get("action");
        if (action === "pause") {
          // AppState보다 먼저 발화할 경우 백그라운드 추적 시간을 직접 누적 후 ref 초기화
          if (backgroundedAtRef.current != null) {
            const diff = Math.floor(
              (Date.now() - backgroundedAtRef.current) / 1000,
            );
            backgroundedAtRef.current = null;
            setElapsedSeconds((s) => s + diff);
          }
          pauseTrackingRef.current();
        } else if (action === "resume") {
          // 일시정지 중 쌓인 stale 값이 AppState에서 더해지지 않도록 초기화
          backgroundedAtRef.current = null;
          resumeTrackingRef.current();
        }
      } catch {}
    };
    const sub = Linking.addEventListener("url", handleURL);
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

    const isWindowOpen = photoWindow?.status === "OPEN";
    // 정상 인증 후에는 summitPhotoWindowRef에 저장된 photoWindow 사용
    const activeWindow = isWindowOpen
      ? photoWindow
      : hasSummited
        ? summitPhotoWindowRef.current
        : null;

    if (activeWindow != null && sessionId != null) {
      try {
        const capturedAt = new Date().toISOString();
        const imageUrl = await uploadTrackingPhoto(result.assets[0].uri);
        console.log("[Tracking] 인증 사진 업로드 완료:", imageUrl);

        await savePhoto({
          sessionId,
          body: {
            milestoneIndex: activeWindow.milestoneIndex,
            milestoneDistanceM: activeWindow.milestoneDistance,
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
        Sentry.captureException(new Error("TrackingPhotoUploadFailed"));
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
          if (data.hikingRecordId != null)
            setHikingRecordId(data.hikingRecordId);
        },
        onError: (err) => {
          console.warn("[Tracking] 세션 종료 실패:", err);
          Sentry.captureException(new Error("TrackingSessionCompleteFailed"));
        },
      });
    }
    // 자유기록은 난이도 평가 없이 바로 종료
    if (isFreeMode) {
      completeTracking(null);
      return;
    }
    setShowDifficultyRating(true);
  };

  const DIFFICULTY_COMPARISON = {
    similar: "SIMILAR",
    easier: "EASIER",
    harder: "HARDER",
  } as const;

  /** 난이도 체감 완료 후 피드백 저장 + 상태 초기화 */
  const completeTracking = (option: "similar" | "easier" | "harder" | null) => {
    if (hikingRecordId != null && option != null) {
      saveDifficultyFeedback(
        { hikingRecordId, comparison: DIFFICULTY_COMPARISON[option] },
        {
          onError: (err) =>
            console.warn("[Tracking] 난이도 피드백 저장 실패:", err),
        },
      );
    }
    if (isLiveActivityEnabled)
      LiveActivity.stop().catch((e: unknown) => {
        console.warn("[LiveActivity] stop() 실패:", e);
      });
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
    summitPhotoWindowRef.current = null;
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
          mapPadding={{
            bottom: isTracking
              ? trackingSheetHeight
              : collapsed
                ? COLLAPSED_PEEK_HEIGHT
                : 448,
            top: 0,
            left: 0,
            right: 0,
          }}
          onCameraChanged={({ reason }) => {
            if (reason === "Gesture") setIsFollowingUser(false);
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
                <Svg
                  width={28}
                  height={28}
                  viewBox="0 0 28 28"
                  fill="none"
                  style={{ position: "absolute", top: 6, left: 0 }}
                >
                  <Circle cx={14} cy={10} r={7} fill="#00D864" />
                  <Circle
                    cx={14}
                    cy={10}
                    r={8.5}
                    stroke="white"
                    strokeWidth={3}
                  />
                </Svg>
                {/* 삼각형 SVG — top: 0, 가로 중앙 */}
                <Svg
                  width={11}
                  height={9}
                  viewBox="0 0 11 9"
                  fill="none"
                  style={{ position: "absolute", top: 0, left: (28 - 11) / 2 }}
                >
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
        {isTracking && photoWindow?.status === "OPEN" && (
          <View
            style={{
              position: "absolute",
              top: 124,
              left: 0,
              right: 0,
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <PhotoWindowBanner
              milestoneDistance={photoWindow.milestoneDistance}
            />
          </View>
        )}
      </View>

      {/* 트래킹 중 — 상단 코스 카드 (자유기록 제외) */}
      {isTracking && !isFreeMode && (
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
                // 정상 인증 → 현재 photoWindow 저장 후 하산 시트로 전환
                summitPhotoWindowRef.current = photoWindow;
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
              isFreeMode={isFreeMode}
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
        mountainId={
          mountainIdParameter
            ? Number(mountainIdParameter)
            : nearbyData?.mountain?.mountainId
        }
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
