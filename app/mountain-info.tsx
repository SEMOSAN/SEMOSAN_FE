import {
  HomeBottomSheetContainer,
  SNAP_COLLAPSED,
  SNAP_DEFAULT,
  SNAP_EXPANDED_WITH_RECORDS,
} from "@/components/home-bottom-sheet-container";
import { BellIcon } from "@/components/icons/bell-icon";
import { CrosshairIcon } from "@/components/icons/crosshair-icon";
import { ImagePlaceholderIcon } from "@/components/icons/image-placeholder-icon";
import { SemosanLogo } from "@/components/icons/semosan-logo";
import { UnvisitedMountainPillMarker } from "@/components/map-markers/unvisited-mountain-pill-marker";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,

  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const TABS = [
  "코스",
  "교통 정보",
  "편의시설",
  "주변 맛집",
  "등산 후기",
] as const;


const MAP_BG_URI =
  "https://www.figma.com/api/mcp/asset/290712df-c28e-4d6b-b1b7-48d12eb7313f";
const COURSES = [
  { level: "초급", levelType: "green", title: "타이틀" },
  { level: "중급", levelType: "blue", title: "타이틀" },
  { level: "상급", levelType: "red", title: "타이틀" },
  { level: "상급", levelType: "red", title: "타이틀" },
  { level: "초급", levelType: "green", title: "타이틀" },
] as const;

export default function MountainInfoScreen() {
  const { top } = useSafeAreaInsets();
  const sheetHeight = useSharedValue(SNAP_DEFAULT);
  const { name, difficulty, elevation } = useLocalSearchParams<{
    name?: string;
    difficulty?: string;
    elevation?: string;
  }>();

  const title = name ?? "관악산";
  const levelText = difficulty ?? "난이도 상";
  const elevationText = elevation ?? "632m";
  const locationButtonStyle = useAnimatedStyle(() => ({
    bottom: sheetHeight.value + 12,
    opacity: interpolate(
      sheetHeight.value,
      [SNAP_COLLAPSED, SNAP_DEFAULT, SNAP_EXPANDED_WITH_RECORDS],
      [1, 1, 0],
      "clamp",
    ),
  }));

  return (
    <View className="flex-1 bg-fill-normal">
      <View style={styles.mapArea}>
        <ExpoImage
          source={{ uri: MAP_BG_URI }}
          style={styles.mapBackground}
          contentFit="cover"
        />
        <LinearGradient
          colors={["rgba(255,255,255,1)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.mapTopGradient}
        />

        <View style={[styles.overlay, { paddingTop: top }]}>
          <View className="h-14 flex-row items-center justify-between px-5">
            <SemosanLogo />
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
              style={styles.shadowBtn}
              hitSlop={8}
            >
              <BellIcon size={24} color="#1A1B1F" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.markerWrap}>
          <UnvisitedMountainPillMarker
            name={title}
            variant="visited"
            selected
          />
        </View>
      </View>

      <Animated.View style={[styles.locationButton, locationButtonStyle]}>
        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
          style={styles.crosshairBtn}
          hitSlop={8}
        >
          <CrosshairIcon size={24} />
        </TouchableOpacity>
      </Animated.View>

      <HomeBottomSheetContainer
        heightSharedValue={sheetHeight}
        snapExpanded={SNAP_EXPANDED_WITH_RECORDS}
        renderContent={({ scrollEnabled, snapState }) => (
          <View style={styles.sheetContent}>
            {snapState === "collapsed" ? (
              <View style={styles.collapsedHeaderRow}>
                <View className="flex-row items-end gap-3">
                  <Text className="text-label-strong typo-title-2-bold">
                    {title}
                  </Text>
                  <Text className="text-label-subtler typo-body-2-normal-regular">
                    경기 과천시 중앙동
                  </Text>
                </View>
                <Text className="text-[24px] text-label-subtle">♡</Text>
              </View>
            ) : (
              <>
                <View
                  style={[
                    styles.sheetHeader,
                    snapState === "expanded" && styles.sheetHeaderExpanded,
                  ]}
                >
                  <View className="flex-row items-end justify-between">
                    <View className="flex-row items-end gap-3">
                      <Text className="text-label-strong typo-title-2-bold">
                        {title}
                      </Text>
                      <Text className="text-label-subtler typo-body-2-normal-regular">
                        경기 과천시 중앙동
                      </Text>
                    </View>
                    <Text className="text-[24px] text-label-subtle">♡</Text>
                  </View>

                  <View className="mt-1 flex-row items-center gap-2">
                    <Text className="text-label-subtle typo-body-2-normal-medium">
                      고도 {elevationText}
                    </Text>
                    <View className="h-0.5 w-0.5 rounded-full bg-label-subtler" />
                    <Text className="text-status-negative-normal typo-body-2-normal-semi-bold">
                      난이도 {levelText}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.sunCard,
                    snapState === "expanded" && styles.sunCardExpanded,
                  ]}
                >
                  <Text className="text-label-subtle typo-body-3-medium">
                    오늘
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <Text className="text-label-subtle typo-body-3-medium">
                      ☼ 일출 05:01
                    </Text>
                    <Text className="text-label-subtle typo-body-3-medium">
                      ☼ 일몰 19:01
                    </Text>
                  </View>
                  <Text style={styles.caretDown}>⌄</Text>
                </View>

                <View
                  style={[
                    styles.tabsSection,
                    snapState === "expanded" && styles.tabsSectionExpanded,
                  ]}
                >
                  <ScrollView
                    style={styles.tabsScroll}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsWrap}
                  >
                    {TABS.map((tab, index) => (
                      <View
                        key={tab}
                        style={[
                          styles.tabItem,
                          index === 0 && styles.tabActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tabText,
                            index === 0 && styles.tabTextActive,
                          ]}
                        >
                          {tab}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>

                {snapState === "expanded" ? (
                  <ScrollView
                    style={styles.courseList}
                    contentContainerStyle={styles.courseListContentExpanded}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollEnabled}
                  >
                    {COURSES.map((item, idx) => (
                      <CourseRow key={`${item.level}-${idx}`} item={item} />
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.courseListDefaultPanel}>
                    <View style={styles.courseListDefault}>
                      {COURSES.map((item, idx) => (
                        <CourseRow key={`${item.level}-${idx}`} item={item} />
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: {
    flex: 1,
    backgroundColor: "#EEF2E8",
    position: "relative",
    overflow: "hidden",
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTopGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 154,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  markerWrap: {
    position: "absolute",
    top: 238,
    left: 154,
  },
  shadowBtn: {
    boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.1)",
  },
  crosshairBtn: {
    width: 48,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  },
  locationButton: {
    position: "absolute",
    right: 20,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  collapsedHeaderRow: {
    height: 44,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 7,
  },
  sheetHeaderExpanded: {
    paddingTop: 20,
  },
  sunCard: {
    marginTop: 16,
    marginHorizontal: 20,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sunCardExpanded: {
    marginTop: 16,
  },
  caretDown: {
    color: "#A4ABC0",
    fontSize: 18,
    lineHeight: 18,
    marginTop: -2,
  },
  tabsSection: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabsSectionExpanded: {
    marginTop: 20,
  },
  tabsWrap: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 8,
  },
  tabsScroll: {
    flexGrow: 0,
    minHeight: 57,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#1A1B1F",
  },
  tabText: {
    fontFamily: "Pretendard",
    fontSize: 16,
    fontWeight: "500",
    color: "#73798C",
  },
  tabTextActive: {
    fontWeight: "600",
    color: "#1A1B1F",
  },
  courseList: {
    flex: 1,
  },
  courseListDefaultPanel: {
    height: 245,
    overflow: "hidden",
  },
  courseListDefault: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  courseListContentExpanded: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
    gap: 16,
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  courseThumb: {
    width: 64,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#F5F6F8",
    borderWidth: 1,
    borderColor: "#ECEEF2",
    alignItems: "center",
    justifyContent: "center",
  },
  courseInfo: {
    flex: 1,
    gap: 6,
  },
  levelBadge: {
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  levelBadgeText: {
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
  levelGreenBg: { backgroundColor: "#DCFCE7" },
  levelGreenText: { color: "#16A34A" },
  levelBlueBg: { backgroundColor: "#EFF6FF" },
  levelBlueText: { color: "#507EF4" },
  levelRedBg: { backgroundColor: "#FEF2F2" },
  levelRedText: { color: "#FF5249" },
});

function CourseRow({
  item,
}: {
  item: { level: string; levelType: "green" | "blue" | "red"; title: string };
}) {
  return (
    <View style={styles.courseRow}>
      <View style={styles.courseThumb}>
        <ImagePlaceholderIcon size={20} color="#D1D5DB" />
      </View>
      <View style={styles.courseInfo}>
        <View className="flex-row items-center gap-1.5">
          <View
            style={[
              styles.levelBadge,
              item.levelType === "green"
                ? styles.levelGreenBg
                : item.levelType === "blue"
                  ? styles.levelBlueBg
                  : styles.levelRedBg,
            ]}
          >
            <Text
              style={[
                styles.levelBadgeText,
                item.levelType === "green"
                  ? styles.levelGreenText
                  : item.levelType === "blue"
                    ? styles.levelBlueText
                    : styles.levelRedText,
              ]}
            >
              {item.level}
            </Text>
          </View>
          <Text className="text-label-strong typo-body-1-normal-semi-bold">
            {item.title}
          </Text>
        </View>
        <Text className="text-label-subtler typo-caption-1-medium">
          10km · 3시간
        </Text>
      </View>
    </View>
  );
}
