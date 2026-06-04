import Clive1Svg from "@/assets/clive1.svg";
import { CliveBottomBar } from "@/components/clive-bottom-bar";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { PencilSimpleIcon } from "@/components/icons/pencil-simple-icon";
import { XIcon } from "@/components/icons/x-icon";
import { useHikingRecordDetail } from "@/features/home/hooks/use-hiking-record-detail";
import { useToggleSemofeedPublic } from "@/features/home/hooks/use-toggle-semofeed-public";
import { useHikingSummary } from "@/features/mypage/hooks/use-hiking-summary";
import { getPhotoReportState } from "@/features/photo-report/photo-report-state";
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

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "--";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m}분`;
  if (m === 0) return `${h}시간`;
  return `${h}시간 ${m}분`;
}

const PhotoReportBg = require("@/assets/photo-report-bg.png");
const OVERLAY_STATS = [
  require("@/assets/overlay-stats-1.png"),
  require("@/assets/overlay-stats-2.png"),
  require("@/assets/overlay-stats-3.png"),
];
type RecordTab = "클라이브" | "포토 리포트";

export default function RecordScreen() {
  const { id, hikingRecordId, name, courseName, imageUri, distance, duration } =
    useLocalSearchParams<{
      id: string;
      hikingRecordId?: string;
      name: string;
      courseName?: string;
      imageUri?: string;
      distance?: string;
      duration?: string;
    }>();
  const sessionId = id ? parseInt(id) : null;
  const hikingRecordIdNum = hikingRecordId ? parseInt(hikingRecordId) : null;
  const distanceKm = distance ? parseFloat(distance) / 1000 : null;
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
  const displayPhotos = [...clivePhotos].reverse();
  const cliveShotRef = useRef<ViewShot | null>(null);
  const photoReportShotRef = useRef<ViewShot | null>(null);
  const activeTabPublic = isPublicByTab[activeTab];

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
      const { photoSource, templateIndex } = getPhotoReportState();
      if (photoSource !== null) setPhotoReportSource(photoSource);
      setPhotoReportTemplate(templateIndex);
    }, []),
  );

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
        <View
          className="mx-5 overflow-hidden rounded-xl"
          style={styles.mapContainer}
        >
          {typeof Clive1Svg === "number" ? (
            <ExpoImage
              source={Clive1Svg}
              style={styles.mapImage}
              contentFit="cover"
            />
          ) : (
            <Clive1Svg width="100%" height="100%" />
          )}
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
            { label: "소요시간", value: "3시간 24분" },
            { label: "고도", value: "642m" },
            { label: "칼로리", value: "1128kcal" },
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
              options={{ format: "jpg", quality: 1 }}
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
                  <View style={styles.cardImagePlaceholder} />
                )}
              </View>
            </ViewShot>

            <CliveBottomBar
              isPublic={activeTabPublic}
              isToggling={isToggling}
              onTogglePublic={handleTogglePublic}
              onSave={handleSavePress}
            />
          </View>
        )}

        {/* 포토 리포트 */}
        {activeTab === "포토 리포트" && (
          <View className="pb-10 pt-2">
            <View style={{ width: 335, alignSelf: "center" }}>
              <ViewShot
                ref={photoReportShotRef}
                options={{ format: "jpg", quality: 1 }}
              >
                <View style={styles.cardWrap}>
                  {/* 배경 사진 */}
                  <ExpoImage
                    source={photoReportSource ?? PhotoReportBg}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                  />

                  {/* 스탯 오버레이 */}
                  <ExpoImage
                    source={
                      OVERLAY_STATS[photoReportTemplate] ?? OVERLAY_STATS[0]
                    }
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    pointerEvents="none"
                  />
                </View>
              </ViewShot>

              {/* 편집하기 버튼 — ViewShot 밖에 위치해 캡처에서 제외 */}
              <TouchableOpacity
                style={[
                  styles.editChip,
                  { position: "absolute", top: 16, right: 16 },
                ]}
                activeOpacity={0.7}
                onPress={() =>
                  router.push({
                    pathname: "/record/photo-report-edit",
                    params: { sessionId: String(sessionId ?? "") },
                  })
                }
              >
                <PencilSimpleIcon size={16} color="#FFFFFF" />
                <Text style={styles.editChipText}>편집하기</Text>
              </TouchableOpacity>
            </View>

            <CliveBottomBar
              isPublic={activeTabPublic}
              isToggling={isToggling}
              onTogglePublic={handleTogglePublic}
              onSave={handleSavePress}
            />
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
  cardImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
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
});
