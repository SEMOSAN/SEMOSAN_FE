import { LocationPermissionSheet } from "@/components/location-permission-sheet";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { FeedHomeView } from "@/features/home/components/feed-home-view";
import { HomeHeader, MapTab } from "@/features/home/components/home-header";
import {
  MapHomeView,
  MapHomeViewRef,
} from "@/features/home/components/map-home-view";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TRANSITION_DURATION = 300;

export default function HomeScreen() {
  const { setTabBarVariant } = useHomeStateContext();
  const [mapTab, setMapTab] = useState<MapTab>("map");
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] =
    useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);

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

  function handleCloseSelected(): void {
    setCloseSelectedToken((prev) => prev + 1);
  }

  return (
    <View className="w-full flex-1">
      <StatusBar style={mapTab === "feed" ? "light" : "dark"} />
      <HomeHeader
        isMountainRecordListOpen={isMountainRecordListOpen}
        onCloseSelected={handleCloseSelected}
        mapTab={mapTab}
        onMapTabChange={handleMapTabChange}
        mapAnimatedStyle={mapAnimatedStyle}
        feedAnimatedStyle={feedAnimatedStyle}
      />
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

      <LocationPermissionSheet />
    </View>
  );
}
