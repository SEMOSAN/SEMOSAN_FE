import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { SemosanLogo } from "@/components/icons/semosan-logo";
import { XIcon } from "@/components/icons/x-icon";
import { PermissionBottomSheet } from "@/components/permission-bottom-sheet";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { FeedHomeView } from "@/features/home/components/feed-home-view";
import {
  MapHomeView,
  MapHomeViewRef,
} from "@/features/home/components/map-home-view";
import { MapTabToggle } from "@/features/home/components/map-tab-toggle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { requestForegroundPermissionsAsync } from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TRANSITION_DURATION = 300;

const bellButtonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
};

type MapTab = "map" | "feed";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { setTabBarVariant } = useHomeStateContext();
  const [mapTab, setMapTab] = useState<MapTab>("map");
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] =
    useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);
  const [showPermissionSheet, setShowPermissionSheet] = useState(false);

  const mapViewRef = useRef<MapHomeViewRef>(null);
  const mapOpacity = useSharedValue(1);
  const feedOpacity = useSharedValue(0);
  const mapAnimatedStyle = useAnimatedStyle(() => ({
    opacity: mapOpacity.value,
  }));
  const feedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: feedOpacity.value,
  }));

  function handleMapTabChange(tab: MapTab): void {
    if (tab === mapTab) return;
    setMapTab(tab);

    if (tab === "feed") {
      mapViewRef.current?.collapseSheet();
      mapOpacity.value = withTiming(0, { duration: TRANSITION_DURATION });
      feedOpacity.value = withTiming(1, { duration: TRANSITION_DURATION });
      setTabBarVariant("dark");
    } else {
      mapViewRef.current?.expandSheet();
      feedOpacity.value = withTiming(0, { duration: TRANSITION_DURATION });
      mapOpacity.value = withTiming(1, { duration: TRANSITION_DURATION });
      setTabBarVariant("light");
    }
  }

  const requestLocation = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") return;
  };

  const handlePermissionConfirm = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    AsyncStorage.setItem("permission_sheet_shown", "true");
    setShowPermissionSheet(false);
    requestLocation();
  };

  function handleCloseSelected(): void {
    setCloseSelectedToken((prev) => prev + 1);
  }

  useEffect(() => {
    AsyncStorage.getItem("permission_sheet_shown").then((val) => {
      if (!val) {
        setShowPermissionSheet(true);
      } else {
        requestLocation();
      }
    });
  }, []);

  return (
    <View className="w-full flex-1">
      <StatusBar style={mapTab === "feed" ? "light" : "dark"} />
      <Animated.View
        className="absolute inset-0"
        style={mapAnimatedStyle}
        pointerEvents={mapTab === "map" ? "auto" : "none"}
      >
        <MapHomeView
          ref={mapViewRef}
          closeSelectedToken={closeSelectedToken}
          onMountainRecordListOpenChange={setIsMountainRecordListOpen}
        />
      </Animated.View>
      <Animated.View
        className="absolute inset-0"
        style={feedAnimatedStyle}
        pointerEvents={mapTab === "feed" ? "auto" : "none"}
      >
        <FeedHomeView />
      </Animated.View>

      <PermissionBottomSheet
        visible={showPermissionSheet}
        onConfirm={handlePermissionConfirm}
      />

      {/* 상단 floating 영역 */}
      <View className="absolute inset-x-0 top-0" pointerEvents="box-none">
        <View style={{ height: top }} />
        {isMountainRecordListOpen ? (
          <View className="h-14 flex-row items-center justify-between px-5">
            <TouchableOpacity
              onPress={handleCloseSelected}
              className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
              style={bellButtonShadow}
              hitSlop={8}
            >
              <ChevronLeftIcon size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCloseSelected}
              className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
              style={bellButtonShadow}
              hitSlop={8}
            >
              <XIcon size={24} />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 헤더: 로고 + 알림 */}
            <View className="h-14 flex-row items-center justify-between px-5">
              <View style={{ width: 109, height: 24 }}>
                <Animated.View style={mapAnimatedStyle}>
                  <SemosanLogo color="#1A1B1F" />
                </Animated.View>
                <Animated.View
                  className="absolute left-0 top-0"
                  style={feedAnimatedStyle}
                >
                  <SemosanLogo color="#ffffff" />
                </Animated.View>
              </View>
              {/* <TouchableOpacity
                className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
                style={bellButtonShadow}
                hitSlop={8}
              >
                <BellIcon size={24} color="#1A1B1F" />
              </TouchableOpacity> */}
            </View>

            {/* 정복 지도 / 세모피드 토글 */}
            <View className="mt-1 items-center">
              <MapTabToggle value={mapTab} onChange={handleMapTabChange} />
            </View>
          </>
        )}
      </View>
    </View>
  );
}
