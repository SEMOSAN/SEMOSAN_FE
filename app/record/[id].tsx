import {
  NaverMapMarkerOverlay,
  NaverMapPathOverlay,
  NaverMapView,
  type NaverMapViewRef,
} from "@mj-studio/react-native-naver-map";
import {
  OVERLAY_COMPONENTS,
  fmtDistance,
  fmtCalories,
  fmtElevation,
  fmtWeather,
  fmtDuration,
  fmtDate,
  type OverlayProps,
} from "@/features/photo-report/overlay-stats";
import { CliveBottomBar } from "@/components/clive-bottom-bar";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { PencilSimpleIcon } from "@/components/icons/pencil-simple-icon";
import { XIcon } from "@/components/icons/x-icon";
import { useHikingRecordDetail } from "@/features/home/hooks/use-hiking-record-detail";
import { useToggleSemofeedPublic } from "@/features/home/hooks/use-toggle-semofeed-public";
import { useHikingSummary } from "@/features/mypage/hooks/use-hiking-summary";
import { useCourseDetail } from "@/features/tracking/hooks/use-course-detail";
import { parseCoursePolyline } from "@/features/tracking/utils/parse-course-polyline";
import { getCenterCoordinate } from "@/utils/get-center-coordinate";
import { getPhotoReportState, setPhotoReportState } from "@/features/photo-report/photo-report-state";
import { useClivePhotos } from "@/features/tracking/hooks/use-clive-photos";
import { uploadImage } from "@/hooks/use-upload-image";
import { api } from "@/lib/api";
import { ENDPOINTS, SemoFeedResponse } from "@/types/api.generated";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";
import { Image as ExpoImage, Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as MediaLibrary from "expo-media-library";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Mask,
  Stop,
  Image as SvgImage,
  LinearGradient as SvgLinearGradient,
  Rect as SvgRect,
} from "react-native-svg";
import ViewShot from "react-native-view-shot";
const ALTITUDE_LABELS = ["400m", "800m", "1200m", "1600m"];
const CLIVE_CARD_HEIGHT = 596;
const DAY_KO = ["일", "월", "화", "수", "목", "금", "토"];

function parseTrack(track?: string): { latitude: number; longitude: number }[] {
  if (!track) return [];
  try {
    const geo = JSON.parse(track);
    if (geo.type === "LineString" && Array.isArray(geo.coordinates)) {
      return geo.coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng,
      }));
    }
  } catch {}
  return [];
}

function formatMapDateParts(startedAt?: string, endedAt?: string): { date: string; time: string } {
  if (!startedAt) return { date: "", time: "" };
  const d = new Date(startedAt);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const day = DAY_KO[d.getDay()];
  const startTime = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  if (!endedAt) return { date: `${yy}.${mm}.${dd} ${day}`, time: startTime };
  const e = new Date(endedAt);
  const endTime = `${String(e.getHours()).padStart(2, "0")}:${String(e.getMinutes()).padStart(2, "0")}`;
  return { date: `${yy}.${mm}.${dd} ${day}`, time: `${startTime} - ${endTime}` };
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

const PhotoReportBg = require("@/assets/photo-report-bg.png");
const ClivEmptyPhotos = require("@/assets/clive-empty-photos.png");
type RecordTab = "클라이브" | "포토 리포트";

export default function RecordScreen() {
  const { id, hikingRecordId, name, courseName, courseId, imageUri, distance, duration } =
    useLocalSearchParams<{
      id: string;
      hikingRecordId?: string;
      name: string;
      courseName?: string;
      courseId?: string;
      imageUri?: string;
      distance?: string;
      duration?: string;
    }>();
  const sessionId = id ? parseInt(id) : null;
  const hikingRecordIdNum = hikingRecordId ? parseInt(hikingRecordId) : null;
  const courseIdNum = courseId ? parseInt(courseId) : null;
  const durationSec = duration ? parseInt(duration) : null;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: togglePublicMutateAsync, isPending: isToggling } =
    useToggleSemofeedPublic();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecordTab>("클라이브");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showPublicToast, setShowPublicToast] = useState(false);
  const [showPrivateToast, setShowPrivateToast] = useState(false);
  const [isPublicByTab, setIsPublicByTab] = useState<
    Record<RecordTab, boolean>
  >(() => ({
    클라이브:
      queryClient.getQueryData<{ id: number; isPublic: boolean }>([
        "record-semofeed",
        sessionId,
        "클라이브",
      ])?.isPublic ?? false,
    "포토 리포트":
      queryClient.getQueryData<{ id: number; isPublic: boolean }>([
        "record-semofeed",
        sessionId,
        "포토 리포트",
      ])?.isPublic ?? false,
  }));
  const [semoFeedIdByTab, setSemoFeedIdByTab] = useState<
    Record<RecordTab, number | null>
  >(() => ({
    클라이브:
      queryClient.getQueryData<{ id: number; isPublic: boolean }>([
        "record-semofeed",
        sessionId,
        "클라이브",
      ])?.id ?? null,
    "포토 리포트":
      queryClient.getQueryData<{ id: number; isPublic: boolean }>([
        "record-semofeed",
        sessionId,
        "포토 리포트",
      ])?.id ?? null,
  }));
  const [photoReportSource, setPhotoReportSource] = useState<
    number | { uri: string } | null
  >(null);
  const [photoReportTemplate, setPhotoReportTemplate] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publicTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const privateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: clivePhotos = [] } = useClivePhotos(sessionId);
  const { data: hikingSummary } = useHikingSummary();
  const { data: recordDetail } = useHikingRecordDetail(hikingRecordIdNum);
  const { data: courseDetail } = useCourseDetail(courseIdNum);
  const distanceKm =
    recordDetail?.distanceMeters != null
      ? recordDetail.distanceMeters / 1000
      : distance
        ? parseFloat(distance) / 1000
        : null;
  const displayPhotos = [...clivePhotos].reverse();
  const cliveShotRef = useRef<ViewShot | null>(null);
  const photoReportShotRef = useRef<ViewShot | null>(null);
  const mapRef = useRef<NaverMapViewRef>(null);
  const activeTabPublic = isPublicByTab[activeTab];
  // 사진이 없는 탭은 빈 카드가 캡처돼 세모피드에 올라가므로 저장/공개를 막는다
  const canShareActiveTab =
    activeTab === "클라이브"
      ? displayPhotos.length > 0
      : photoReportSource != null;
  const trackCoords = parseTrack(recordDetail?.track);

  const captureCard = async (tab: RecordTab) => {
    const targetRef = tab === "클라이브" ? cliveShotRef : photoReportShotRef;
    return targetRef.current?.capture?.();
  };

  const ensureSemoFeed = async (tab: RecordTab, capturedUri?: string) => {
    const existingFeedId = semoFeedIdByTab[tab];
    if (existingFeedId) return existingFeedId;

    const imageUri = capturedUri ?? (await captureCard(tab));
    if (!imageUri) return null;

    const imageUrl = await uploadImage(
      imageUri,
      `semo-feed-${tab}-${Date.now()}.jpg`,
      "semofeed",
    );
    const res = await api.post<SemoFeedResponse>({
      path: ENDPOINTS.SEMOFEED,
      body: { imageUrl },
    });

    const createdFeedId = res.data?.id ?? null;
    if (!createdFeedId) return null;

    const isPublic = !!res.data?.isPublic;
    setSemoFeedIdByTab((prev) => ({ ...prev, [tab]: createdFeedId }));
    setIsPublicByTab((prev) => ({ ...prev, [tab]: isPublic }));
    queryClient.setQueryData(["record-semofeed", sessionId, tab], {
      id: createdFeedId,
      isPublic,
    });
    return createdFeedId;
  };

  useFocusEffect(
    useCallback(() => {
      const saved = getPhotoReportState();
      // 같은 세션의 상태만 복원 — 다른 기록의 사진이 유입되지 않도록
      if (saved.sessionId === sessionId && saved.photoSource !== null) {
        setPhotoReportSource(saved.photoSource);
      }
      if (saved.sessionId === sessionId) {
        setPhotoReportTemplate(saved.templateIndex);
      }
    }, [sessionId]),
  );

  // 경로 로드 후 카메라 fit
  useEffect(() => {
    if (trackCoords.length < 2) return;
    const lats = trackCoords.map((c) => c.latitude);
    const lngs = trackCoords.map((c) => c.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padding = 0.15;
    setTimeout(() => {
      mapRef.current?.animateCameraWithTwoCoords({
        coord1: { latitude: minLat - (maxLat - minLat) * padding, longitude: minLng - (maxLng - minLng) * padding },
        coord2: { latitude: maxLat + (maxLat - minLat) * padding, longitude: maxLng + (maxLng - minLng) * padding },
        duration: 300,
      });
    }, 300);
  }, [trackCoords.length]);

  // 클라이브 사진 프리페치 + 포토리포트 기본 사진 = 마지막 사진(정상)
  useEffect(() => {
    if (clivePhotos.length === 0) return;
    clivePhotos.forEach((url) => Image.prefetch(url));
    if (photoReportSource === null) {
      setPhotoReportSource({ uri: clivePhotos[clivePhotos.length - 1] });
    }
  }, [clivePhotos]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (publicTimerRef.current) clearTimeout(publicTimerRef.current);
      if (privateTimerRef.current) clearTimeout(privateTimerRef.current);
    };
  }, []);

  const handleSavePress = async () => {
    if (!canShareActiveTab) return;
    try {
      const imageUri = await captureCard(activeTab);
      if (!imageUri) return;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return;

      await MediaLibrary.saveToLibraryAsync(imageUri);
      await ensureSemoFeed(activeTab, imageUri);
    } catch (error) {
      console.error("[Record] save failed", error);
      return;
    }

    setShowSaveToast(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleTogglePublic = async () => {
    if (!canShareActiveTab) return;
    try {
      const semoFeedId = await ensureSemoFeed(activeTab);
      if (!semoFeedId) return;

      await togglePublicMutateAsync(semoFeedId);

      const nextPublic = !activeTabPublic;
      setIsPublicByTab((prev) => ({ ...prev, [activeTab]: nextPublic }));
      queryClient.setQueryData(["record-semofeed", sessionId, activeTab], {
        id: semoFeedId,
        isPublic: nextPublic,
      });
      queryClient.invalidateQueries({ queryKey: [ENDPOINTS.SEMOFEED] });

      if (nextPublic) {
        setShowPrivateToast(false);
        if (privateTimerRef.current) clearTimeout(privateTimerRef.current);

        setShowPublicToast(true);
        if (publicTimerRef.current) clearTimeout(publicTimerRef.current);
        publicTimerRef.current = setTimeout(
          () => setShowPublicToast(false),
          3000,
        );
      } else {
        setShowPublicToast(false);
        if (publicTimerRef.current) clearTimeout(publicTimerRef.current);

        setShowPrivateToast(true);
        if (privateTimerRef.current) clearTimeout(privateTimerRef.current);
        privateTimerRef.current = setTimeout(
          () => setShowPrivateToast(false),
          3000,
        );
      }
    } catch (error) {
      console.error("[SemoFeed] public toggle failed", error);
      Sentry.captureException(error);
      return;
    }
  };

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="h-14 flex-row items-center justify-between px-5">
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <ChevronLeftIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <XIcon size={24} />
          </TouchableOpacity>
        </View>

        {/* 산 이름 + 코스명 */}
        <View className="flex-row items-center gap-2 px-5 pb-3">
          <View style={styles.mountainIconCircle}>
            <View style={styles.mountainIconInner} />
          </View>
          <Text className="text-label-normal typo-body-1-normal-semi-bold">
            {name ?? "관악산"}
          </Text>
          <Text
            className="text-label-subtle typo-body-1-normal-medium"
            numberOfLines={1}
          >
            {courseName ?? ""}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 거리 */}
        <View className="flex-row items-end px-5 pb-3 pt-4" style={{ gap: 4 }}>
          <Text style={styles.distanceNumber}>
            {distanceKm != null ? distanceKm.toFixed(2) : "--"}
          </Text>
          <Text style={styles.distanceUnit}>km</Text>
        </View>

        {/* 루트 지도 */}
        <View className="mx-5 overflow-hidden rounded-xl" style={styles.mapContainer}>
          {(() => {
            const hasTrack = trackCoords.length > 1;
            const courseCoords = parseCoursePolyline(courseDetail?.polyline);
            const mapCoords = hasTrack ? trackCoords : courseCoords;
            const mapCenter = getCenterCoordinate(mapCoords);
            const center = mapCenter ?? { latitude: 37.5665, longitude: 126.9780 };

            const lats = mapCoords.map((c) => c.latitude);
            const lngs = mapCoords.map((c) => c.longitude);
            const latKm = (Math.max(...lats) - Math.min(...lats)) * 111;
            const lngKm = (Math.max(...lngs) - Math.min(...lngs)) * 89;
            const dominantRatio = Math.max(lngKm / 12, latKm / 7);
            const zoom = mapCoords.length > 1
              ? Math.min(Math.max(Math.round(11 + Math.log2(0.6 / dominantRatio)), 6), 18)
              : 13;

            return (
              <NaverMapView
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                camera={{ ...center, zoom }}
                isScrollGesturesEnabled={false}
                isZoomGesturesEnabled={false}
                isRotateGesturesEnabled={false}
                isTiltGesturesEnabled={false}
                isStopGesturesEnabled={false}
                logoAlign="BottomLeft"
                logoMargin={{ bottom: 4, left: 4 }}
              >
                {mapCoords.length > 1 && (
                  <>
                    <NaverMapPathOverlay coords={mapCoords} width={4} color="#FFD40D" outlineWidth={1} outlineColor="#eab308" />
                    <NaverMapMarkerOverlay
                      latitude={mapCoords[0].latitude}
                      longitude={mapCoords[0].longitude}
                      width={14} height={14} anchor={{ x: 0.5, y: 0.5 }}
                    >
                      <View style={styles.dotMarkerBlue} />
                    </NaverMapMarkerOverlay>
                    <NaverMapMarkerOverlay
                      latitude={mapCoords[mapCoords.length - 1].latitude}
                      longitude={mapCoords[mapCoords.length - 1].longitude}
                      width={14} height={14} anchor={{ x: 0.5, y: 0.5 }}
                    >
                      <View style={styles.dotMarkerRed} />
                    </NaverMapMarkerOverlay>
                  </>
                )}
                {hasTrack && (recordDetail?.photos ?? []).map((photo) => (
                  <NaverMapMarkerOverlay
                    key={photo.milestoneIndex}
                    latitude={photo.lat}
                    longitude={photo.lng}
                    width={24} height={24} anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <View style={styles.photoMarkerWrap}>
                      <ExpoImage
                        source={{ uri: photo.imageUrl }}
                        style={styles.photoMarkerImg}
                        contentFit="cover"
                      />
                    </View>
                  </NaverMapMarkerOverlay>
                ))}
              </NaverMapView>
            );
          })()}
          {/* 날짜/시간 배지 */}
          <View style={styles.dateBadgeWrap}>
            {(() => {
              const { date, time } = formatMapDateParts(recordDetail?.startedAt, recordDetail?.endedAt);
              return (
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeDateText}>{date || "--"}</Text>
                  {!!time && <Text style={styles.dateBadgeTimeText}>{" " + time}</Text>}
                </View>
              );
            })()}
          </View>
        </View>

        {/* 통계 */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 16,
            marginBottom: 16,
            gap: 4,
          }}
        >
          {[
            { label: "소요시간", value: formatDuration(recordDetail?.durationSeconds ?? durationSec) },
            { label: "고도", value: recordDetail?.ascentMeters != null ? `${Math.round(recordDetail.ascentMeters)}Nm` : "--" },
            { label: "칼로리", value: recordDetail?.calories != null ? `${recordDetail.calories}kcal` : "--" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 탭 */}
        <View className="flex-row items-center gap-4 px-5 pb-4 pt-5">
          {(["클라이브", "포토 리포트"] as RecordTab[]).map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.tabActive : styles.tabInactive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 클라이브 */}
        {activeTab === "클라이브" && (
          <View className="pb-10 pt-2">
            <ViewShot
              ref={cliveShotRef}
              options={{ format: "png", quality: 1 }}
              style={{ width: 335, alignSelf: "center" }}
            >
              <View style={styles.cardWrap}>
                {/* 왼쪽 그라디언트 바 — 정상 완료: 빨강까지 full */}
                <LinearGradient
                  colors={["#507EF4", "#4ADE80", "#FFD40D", "#FF5249"]}
                  locations={[0, 0.33, 0.66, 1]}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientBar}
                />

                {displayPhotos.length > 0 ? (
                  (() => {
                    const photoHeight =
                      CLIVE_CARD_HEIGHT / displayPhotos.length;
                    const BLEND = 30; // 경계 블렌딩 픽셀

                    const maskDefs = displayPhotos.map((_, i) => {
                      const hasTop = i > 0;
                      const hasBottom = i < displayPhotos.length - 1;
                      const yStart = i * photoHeight - (hasTop ? BLEND : 0);
                      const totalH =
                        photoHeight +
                        (hasTop ? BLEND : 0) +
                        (hasBottom ? BLEND : 0);
                      const stops: { offset: string; op: string }[] = [];
                      if (hasTop) {
                        stops.push({ offset: "0", op: "0" });
                        stops.push({
                          offset: (BLEND / totalH).toFixed(3),
                          op: "1",
                        });
                      } else {
                        stops.push({ offset: "0", op: "1" });
                      }
                      if (hasBottom) {
                        stops.push({
                          offset: ((totalH - BLEND) / totalH).toFixed(3),
                          op: "1",
                        });
                        stops.push({ offset: "1", op: "0" });
                      } else {
                        stops.push({ offset: "1", op: "1" });
                      }
                      return { i, yStart, totalH, stops };
                    });

                    return (
                      <>
                        <Svg
                          width={335}
                          height={CLIVE_CARD_HEIGHT}
                          style={StyleSheet.absoluteFill}
                        >
                          <Defs>
                            {maskDefs.flatMap((d) => [
                              <SvgLinearGradient
                                key={`grad-${d.i}`}
                                id={`fade-${d.i}`}
                                x1="0"
                                y1={d.yStart}
                                x2="0"
                                y2={d.yStart + d.totalH}
                                gradientUnits="userSpaceOnUse"
                              >
                                {d.stops.map((s, j) => (
                                  <Stop
                                    key={j}
                                    offset={s.offset}
                                    stopColor="white"
                                    stopOpacity={s.op}
                                  />
                                ))}
                              </SvgLinearGradient>,
                              <Mask
                                key={`mask-${d.i}`}
                                id={`mask-${d.i}`}
                                x={0}
                                y={d.yStart}
                                width={335}
                                height={d.totalH}
                                maskUnits="userSpaceOnUse"
                              >
                                <SvgRect
                                  x={0}
                                  y={d.yStart}
                                  width={335}
                                  height={d.totalH}
                                  fill={`url(#fade-${d.i})`}
                                />
                              </Mask>,
                            ])}
                          </Defs>
                          {/* 역순 렌더링: 위쪽 사진(summit)이 z-order 최상단 */}
                          {[...displayPhotos].reverse().map((url, revIdx) => {
                            const i = displayPhotos.length - 1 - revIdx;
                            const d = maskDefs[i];
                            return (
                              <SvgImage
                                key={url}
                                href={{ uri: url }}
                                x={0}
                                y={d.yStart}
                                width={335}
                                height={d.totalH}
                                preserveAspectRatio="xMidYMid slice"
                                mask={`url(#mask-${i})`}
                              />
                            );
                          })}
                        </Svg>

                        {/* 스탬프 오버레이 */}
                        {displayPhotos.map((url, displayIndex) => {
                          const originalIndex =
                            clivePhotos.length - 1 - displayIndex;
                          const isSummit =
                            originalIndex === clivePhotos.length - 1;
                          const altitudeLabel =
                            ALTITUDE_LABELS[originalIndex] ?? "";
                          return (
                            <View
                              key={url + "-stamp"}
                              style={{
                                position: "absolute",
                                top: displayIndex * photoHeight,
                                left: 0,
                                right: 0,
                                height: photoHeight,
                              }}
                            >
                              {isSummit ? (
                                <View
                                  style={[
                                    StyleSheet.absoluteFill,
                                    styles.stampSummitContainer,
                                  ]}
                                >
                                  <View style={styles.summitBadge}>
                                    <Text style={styles.summitBadgeText}>
                                      정상
                                    </Text>
                                  </View>
                                  <Text style={styles.altitudeText}>
                                    {altitudeLabel}
                                  </Text>
                                </View>
                              ) : (
                                <View
                                  style={[
                                    StyleSheet.absoluteFill,
                                    styles.stampCenterContainer,
                                  ]}
                                >
                                  <Text style={styles.altitudeText}>
                                    {altitudeLabel}
                                  </Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </>
                    );
                  })()
                ) : (
                  <View
                    style={{ width: "100%", height: "100%", borderRadius: 20 }}
                    className="items-center justify-center gap-2 border border-dashed border-line-normal bg-fill-normal px-8"
                  >
                    <Text className="typo-body-1-normal-semi-bold text-center text-label-disabled">
                      클라이브를 생성할 수 없어요
                    </Text>
                    <Text className="typo-body-2-normal-regular text-center text-neutral-100">
                      {"등산하며 찍은 사진이 없어요\n다음에는 클라이브 도전!"}
                    </Text>
                    <ExpoImage
                      source={ClivEmptyPhotos}
                      style={{ width: 198, height: 166, marginTop: 16 }}
                      contentFit="contain"
                    />
                    <TouchableOpacity
                      className="mt-6 flex-row items-center gap-1.5 rounded-full bg-primary-normal px-5 py-3"
                      activeOpacity={0.85}
                      onPress={() =>
                        router.push({
                          pathname: "/(tabs)",
                          params: { tab: "feed" },
                        })
                      }
                    >
                      <Text className="typo-body-2-normal-semi-bold text-label-normal-inverse">
                        클라이브 둘러보기 →
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </ViewShot>

            {displayPhotos.length > 0 && (
              <CliveBottomBar
                isPublic={activeTabPublic}
                isToggling={isToggling}
                onTogglePublic={handleTogglePublic}
                onSave={handleSavePress}
              />
            )}
          </View>
        )}

        {/* 포토 리포트 */}
        {activeTab === "포토 리포트" && (
          <View className="pb-10 pt-2">
            <View style={{ width: 335, alignSelf: "center" }}>
              <ViewShot
                ref={photoReportShotRef}
                options={{ format: "png", quality: 1 }}
              >
                <View style={styles.cardWrap}>
                  {/* 배경 사진 */}
                  <ExpoImage
                    source={photoReportSource ?? PhotoReportBg}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />

                  {/* 스탯 오버레이 — 사진이 있을 때만 표시 */}
                  {photoReportSource != null &&
                    (() => {
                      const OverlayComponent = OVERLAY_COMPONENTS[photoReportTemplate] ?? OVERLAY_COMPONENTS[0];
                      const overlayProps: OverlayProps = {
                        distance: fmtDistance(recordDetail?.distanceMeters),
                        calories: fmtCalories(recordDetail?.calories),
                        elevation: fmtElevation(recordDetail?.ascentMeters),
                        weather: fmtWeather(recordDetail?.temperature),
                        duration: fmtDuration(recordDetail?.durationSeconds),
                        date: fmtDate(recordDetail?.startedAt),
                        scale: 335 / 240,
                      };
                      return <OverlayComponent {...overlayProps} />;
                    })()}
                </View>
              </ViewShot>

              {/* 편집하기 버튼 — ViewShot 밖에 위치해 캡처에서 제외 */}
              <TouchableOpacity
                style={[
                  styles.editChip,
                  { position: "absolute", top: 16, right: 16 },
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  // 현재 표시 중인 사진/템플릿을 상태에 저장 → 편집 화면에서 이어받음
                  setPhotoReportState({
                    sessionId,
                    photoSource: photoReportSource,
                    templateIndex: photoReportTemplate,
                  });
                  router.push({
                    pathname: "/record/photo-report-edit",
                    params: {
                      sessionId: String(sessionId ?? ""),
                      hikingRecordId: String(hikingRecordIdNum ?? ""),
                    },
                  });
                }}
              >
                <PencilSimpleIcon size={16} color="#FFFFFF" />
                <Text style={styles.editChipText}>편집하기</Text>
              </TouchableOpacity>
            </View>

            {photoReportSource != null && (
              <CliveBottomBar
                isPublic={activeTabPublic}
                isToggling={isToggling}
                onTogglePublic={handleTogglePublic}
                onSave={handleSavePress}
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* 저장 토스트 - 화면 중앙 */}
      {showSaveToast && (
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View
            style={{
              height: 48,
              backgroundColor: "#2F323A",
              borderRadius: 12,
              gap: 8,
              alignSelf: "center",
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon size={20} color="#FFFFFF" />
            <Text
              className="typo-body-2-normal-medium"
              style={{ color: "#FFFFFF" }}
            >
              사진에 저장 완료
            </Text>
          </View>
        </View>
      )}

      {/* 전체공개 토스트 - 화면 중앙 */}
      {showPublicToast && (
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View
            style={{
              height: 48,
              backgroundColor: "#2F323A",
              borderRadius: 12,
              gap: 8,
              alignSelf: "center",
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon size={20} color="#FFFFFF" />
            <Text
              className="typo-body-2-normal-medium"
              style={{ color: "#FFFFFF" }}
            >
              세모피드에 공개 완료
            </Text>
          </View>
        </View>
      )}

      {/* 나만보기 토스트 - 화면 중앙 */}
      {showPrivateToast && (
        <View
          className="absolute inset-0 items-center justify-center"
          pointerEvents="none"
        >
          <View
            style={{
              height: 48,
              backgroundColor: "#2F323A",
              borderRadius: 12,
              gap: 8,
              alignSelf: "center",
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CheckCircleIcon size={20} color="#FFFFFF" />
            <Text
              className="typo-body-2-normal-medium"
              style={{ color: "#FFFFFF" }}
            >
              나만 보기
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mountainIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 999,
    backgroundColor: "#00D864",
    alignItems: "center",
    justifyContent: "center",
  },
  mountainIconInner: {
    width: 12,
    height: 8,
    backgroundColor: "#DCFCE7",
  },
  distanceNumber: {
    fontFamily: "Lexend_700Bold",
    fontSize: 60,
    color: "#1A1B1F",
    lineHeight: 72,
  },
  distanceUnit: {
    fontSize: 24,
    fontWeight: "500",
    color: "#464A57",
    lineHeight: 29,
    paddingBottom: 6,
  },
  mapContainer: {
    height: 235,
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: 235,
  },
  dateBadgeWrap: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  dateBadge: {
    backgroundColor: "#464A57",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  dateBadgeDateText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  dateBadgeTimeText: {
    color: "#E5E7EB",
    fontSize: 13,
    fontWeight: "500",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    gap: 6,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#73798C",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1B1F",
  },
  divider: {
    height: 6,
    backgroundColor: "#F9FAFB",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "600",
  },
  tabActive: {
    color: "#1A1B1F",
  },
  tabInactive: {
    color: "#BFC4D1",
  },
  // 포토 리포트 오버레이
  editChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1B1F",
    borderRadius: 999,
    paddingLeft: 8,
    paddingRight: 10,
    paddingVertical: 6,
    gap: 4,
  },
  editChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardWrap: {
    width: 335,
    height: 596,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  gradientBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    zIndex: 2,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  stampSummitContainer: {
    justifyContent: "flex-end",
    paddingLeft: 24,
    paddingBottom: 42,
    gap: 4,
  },
  stampCenterContainer: {
    justifyContent: "center",
    paddingLeft: 24,
  },
  summitBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  summitBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  altitudeText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Lexend_700Bold",
    fontWeight: "700",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 13,
  },
  dotMarkerBlue: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#507EF4",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  dotMarkerRed: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#FF5249",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  photoMarkerWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  photoMarkerImg: {
    width: 24,
    height: 24,
  },
});
