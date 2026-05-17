import { BellIcon } from "@/components/icons/bell-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { SemosanLogo } from "@/components/icons/semosan-logo";
import { XIcon } from "@/components/icons/x-icon";
import { FeedHomeView } from "@/features/home/components/feed-home-view";
import { MapHomeView, type MapHomeViewRef } from "@/features/home/components/map-home-view";
import { MapTabToggle, type MapTab } from "@/features/home/components/map-tab-toggle";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TRANSITION_DURATION = 300;

export default function HomeScreen(): React.JSX.Element {
  const [mapTab, setMapTab] = useState<MapTab>("map");
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] = useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);
  const { top } = useSafeAreaInsets();
  const mapViewRef = useRef<MapHomeViewRef>(null);
  const { setTabBarVariant } = useHomeStateContext();

  const mapOpacity = useSharedValue(1);
  const feedOpacity = useSharedValue(0);

  const mapAnimatedStyle = useAnimatedStyle(() => ({ opacity: mapOpacity.value }));
  const feedAnimatedStyle = useAnimatedStyle(() => ({ opacity: feedOpacity.value }));

  function handleMapTabChange(tab: MapTab): void {
    if (tab === mapTab) return;
    setMapTab(tab);

    if (tab === "feed") {
      setTabBarVariant("dark");
      mapViewRef.current?.collapseSheet();
      mapOpacity.value = withTiming(0, { duration: TRANSITION_DURATION });
      feedOpacity.value = withTiming(1, { duration: TRANSITION_DURATION });
    } else {
      setTabBarVariant("light");
      mapViewRef.current?.expandSheet();
      feedOpacity.value = withTiming(0, { duration: TRANSITION_DURATION });
      mapOpacity.value = withTiming(1, { duration: TRANSITION_DURATION });
    }
  }

  function handleCloseSelected(): void {
    setCloseSelectedToken((prev) => prev + 1);
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={mapTab === "feed" ? "light" : "dark" } />
      <Animated.View
        style={[StyleSheet.absoluteFill, mapAnimatedStyle]}
        pointerEvents={mapTab === "map" ? "auto" : "none"}
      >
        <MapHomeView
          ref={mapViewRef}
          closeSelectedToken={closeSelectedToken}
          onMountainRecordListOpenChange={setIsMountainRecordListOpen}
        />
      </Animated.View>

      <Animated.View
        style={[StyleSheet.absoluteFill, feedAnimatedStyle]}
        pointerEvents={mapTab === "feed" ? "auto" : "none"}
      >
        <FeedHomeView />
      </Animated.View>

      {/* 공유 헤더 — 항상 최상단에 오버레이 */}
      <View style={[styles.headerOverlay, { top: 0 }]} pointerEvents="box-none">
        <View style={{ height: top }} />
        {isMountainRecordListOpen ? (
          <View style={styles.headerRow} pointerEvents="box-none">
            <TouchableOpacity
              onPress={handleCloseSelected}
              className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
              style={styles.shadowButton}
              hitSlop={8}
            >
              <ChevronLeftIcon size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseSelected}
              className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
              style={styles.shadowButton}
              hitSlop={8}
            >
              <XIcon size={24} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.headerRow} pointerEvents="box-none">
              <View>
                <Animated.View style={mapAnimatedStyle}>
                  <SemosanLogo color="#1A1B1F" />
                </Animated.View>
                <Animated.View style={[StyleSheet.absoluteFill, feedAnimatedStyle]}>
                  <SemosanLogo color="#ffffff" />
                </Animated.View>
              </View>
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-fill-normal items-center justify-center"
                style={styles.shadowButton}
                hitSlop={8}
              >
                <BellIcon size={24} color="#1A1B1F" />
              </TouchableOpacity>
            </View>
            <View style={styles.toggleRow} pointerEvents="box-none">
              <MapTabToggle value={mapTab} onChange={handleMapTabChange} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 56,
  },
  toggleRow: {
    alignItems: "center",
    marginTop: 4,
  },
  shadowButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
