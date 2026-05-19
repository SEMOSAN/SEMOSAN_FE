import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image as ExpoImage } from "expo-image";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Clive1Svg from "@/assets/clive1.svg";
import Clive2Svg from "@/assets/clive2.svg";
import SemosanLogoSvg from "@/assets/semosan-logo.svg";
import { PencilSimpleIcon } from "@/components/icons/pencil-simple-icon";
const PhotoReportBg = require("@/assets/photo-report-bg.png");
const OVERLAY_STATS = [
  require("@/assets/overlay-stats-1.png"),
  require("@/assets/overlay-stats-2.png"),
  require("@/assets/overlay-stats-3.png"),
];
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { XIcon } from "@/components/icons/x-icon";
import { CliveBottomBar } from "@/components/clive-bottom-bar";
import { getPhotoReportState } from "@/features/photo-report/photo-report-state";

type RecordTab = "클라이브" | "포토 리포트";

export default function RecordScreen() {
  const { id, name, imageUri } = useLocalSearchParams<{
    id: string;
    name: string;
    imageUri?: string;
  }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<RecordTab>("클라이브");
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showPublicToast, setShowPublicToast] = useState(false);
  const [showPrivateToast, setShowPrivateToast] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [photoReportSource, setPhotoReportSource] = useState<number | { uri: string } | null>(null);
  const [photoReportTemplate, setPhotoReportTemplate] = useState(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const publicTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const privateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      const { photoSource, templateIndex } = getPhotoReportState();
      if (photoSource !== null) setPhotoReportSource(photoSource);
      setPhotoReportTemplate(templateIndex);
    }, [])
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (publicTimerRef.current) clearTimeout(publicTimerRef.current);
      if (privateTimerRef.current) clearTimeout(privateTimerRef.current);
    };
  }, []);

  const handleSavePress = () => {
    setShowSaveToast(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleTogglePublic = () => {
    if (!isPublic) {
      setIsPublic(true);
      setShowPublicToast(true);
      if (publicTimerRef.current) clearTimeout(publicTimerRef.current);
      publicTimerRef.current = setTimeout(
        () => setShowPublicToast(false),
        3000
      );
    } else {
      setIsPublic(false);
      setShowPrivateToast(true);
      if (privateTimerRef.current) clearTimeout(privateTimerRef.current);
      privateTimerRef.current = setTimeout(
        () => setShowPrivateToast(false),
        3000
      );
    }
  };

  return (
    <View className="flex-1 bg-fill-normal">
      {/* 헤더 */}
      <View style={{ paddingTop: top }} className="bg-fill-normal">
        <View className="flex-row items-center justify-between px-5 h-14">
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
          <Text className="typo-body-1-normal-semi-bold text-label-normal">
            {name ?? "관악산"}
          </Text>
          <Text
            className="typo-body-1-normal-medium text-label-subtle"
            numberOfLines={1}
          >
            과천향교 출발 코스
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 거리 */}
        <View
          className="flex-row items-end px-5 pt-4 pb-3"
          style={{ gap: 4 }}
        >
          <Text style={styles.distanceNumber}>6.34</Text>
          <Text style={styles.distanceUnit}>km</Text>
        </View>

        {/* 루트 지도 */}
        <View
          className="mx-5 rounded-xl overflow-hidden"
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
        <View className="flex-row mx-5 mt-4 mb-4">
          {[
            { label: "소요시간", value: "2시간 16분" },
            { label: "고도", value: "15Nm" },
            { label: "칼로리", value: "360kcal" },
          ].map((stat, i) => (
            <View
              key={stat.label}
              style={[styles.statItem, i < 2 && styles.statDivider]}
            >
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 탭 */}
        <View className="flex-row px-5 pt-5 pb-4 gap-4">
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
            <View style={styles.cardWrap}>
              <LinearGradient
                colors={["#507EF4", "#4ADE80", "#FFD40D", "#FF5249"]}
                locations={[0, 0.33, 0.66, 1]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.gradientBar}
              />
              {typeof Clive2Svg === "number" ? (
                <ExpoImage
                  source={Clive2Svg}
                  style={styles.cardImage}
                  contentFit="cover"
                />
              ) : (
                <Clive2Svg width="100%" height="100%" />
              )}
            </View>

            <CliveBottomBar
              isPublic={isPublic}
              onTogglePublic={handleTogglePublic}
              onSave={handleSavePress}
            />
          </View>
        )}

        {/* 포토 리포트 */}
        {activeTab === "포토 리포트" && (
          <View className="pb-10 pt-2">
            <View style={styles.cardWrap}>
              {/* 배경 사진 */}
              <ExpoImage
                source={photoReportSource ?? PhotoReportBg}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
              />

              {/* 스탯 오버레이 */}
              <ExpoImage
                source={OVERLAY_STATS[photoReportTemplate]}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                pointerEvents="none"
              />

              {/* 편집하기 버튼 */}
              <TouchableOpacity
                style={styles.editChip}
                activeOpacity={0.7}
                onPress={() => router.push("/record/photo-report-edit")}
              >
                <PencilSimpleIcon size={16} color="#FFFFFF" />
                <Text style={styles.editChipText}>편집하기</Text>
              </TouchableOpacity>

            </View>

            <CliveBottomBar
              isPublic={isPublic}
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
    gap: 4,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: "#F0F1F4",
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
    position: "absolute",
    top: 16,
    right: 16,
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
});
