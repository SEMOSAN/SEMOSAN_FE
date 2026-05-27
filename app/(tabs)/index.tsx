import { LocationPermissionSheet } from "@/components/location-permission-sheet";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { FeedHomeView } from "@/features/home/components/feed-home-view";
import { HomeHeader, MapTab } from "@/features/home/components/home-header";
import {
  MapHomeView,
  MapHomeViewRef,
} from "@/features/home/components/map-home-view";
import { HOME_TAB_TRANSITION_DURATION } from "@/features/home/constants";
import { setStatusBarStyle } from "expo-status-bar";
import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";


export default function HomeScreen() {
  const { setTabBarVariant, tabProgress } = useHomeStateContext();
  const [mapTab, setMapTab] = useState<MapTab>("map");
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] =
    useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);

  const mapViewRef = useRef<MapHomeViewRef>(null);
  const mapAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - tabProgress.value,
  }));
  const feedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabProgress.value,
    transform: [
      { translateY: interpolate(tabProgress.value, [0, 1], [80, 0]) },
    ],
  }));
  const feedOpacityStyle = useAnimatedStyle(() => ({
    opacity: tabProgress.value,
  }));

  function handleMapTabChange(tab: MapTab): void {
    if (tab === mapTab) return;
    setMapTab(tab);

    if (tab === "feed") {
      mapViewRef.current?.collapseSheet();
      tabProgress.value = withTiming(1, {
        duration: HOME_TAB_TRANSITION_DURATION,
        easing: Easing.out(Easing.sin),
      });
      setTabBarVariant("dark");
      setStatusBarStyle("light");
    } else {
      mapViewRef.current?.expandSheet();
      tabProgress.value = withTiming(0, {
        duration: HOME_TAB_TRANSITION_DURATION,
        easing: Easing.in(Easing.sin),
      });
      setTabBarVariant("light");
      setStatusBarStyle("dark");
    }
  }

  function handleCloseSelected(): void {
    setCloseSelectedToken((prev) => prev + 1);
  }

  return (
    <View className="w-full flex-1">
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
        className="absolute inset-x-0 bottom-0"
        style={[{ top: -80 }, feedAnimatedStyle]}
        pointerEvents={mapTab === "feed" ? "auto" : "none"}
      >
        <FeedHomeView />
      </Animated.View>

      <HomeHeader
        isMountainRecordListOpen={isMountainRecordListOpen}
        onCloseSelected={handleCloseSelected}
        mapTab={mapTab}
        onMapTabChange={handleMapTabChange}
        mapAnimatedStyle={mapAnimatedStyle}
        feedAnimatedStyle={feedOpacityStyle}
      />
      <LocationPermissionSheet />
    </View>
  );
}
