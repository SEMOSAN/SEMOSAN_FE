import { LocationPermissionSheet } from "@/components/location-permission-sheet";
import { useHomeStateContext } from "@/contexts/home-state-context";
import { FeedHomeView } from "@/features/home/components/feed-home-view";
import { HomeHeader, MapTab } from "@/features/home/components/home-header";
import {
  MapHomeView,
  MapHomeViewRef,
} from "@/features/home/components/map-home-view";
import {
  FEED_SLIDE_UP_DISTANCE,
  HOME_TAB_TRANSITION_DURATION,
} from "@/features/home/constants";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export default function HomeScreen() {
  const { setTabBarVariant, tabProgress } = useHomeStateContext();
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [mapTab, setMapTab] = useState<MapTab>("map");

  const [hasFeedMounted, setHasFeedMounted] = useState(false);
  const [isMountainRecordListOpen, setIsMountainRecordListOpen] =
    useState(false);
  const [closeSelectedToken, setCloseSelectedToken] = useState(0);

  const mapViewRef = useRef<MapHomeViewRef>(null);
  const feedMountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    feedMountTimerRef.current = setTimeout(() => {
      setHasFeedMounted(true);
    }, 3000);
    return () => {
      if (feedMountTimerRef.current) clearTimeout(feedMountTimerRef.current);
    };
  }, []);
  const mapAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - tabProgress.value,
  }));
  const feedAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tabProgress.value,
    transform: [
      {
        translateY: interpolate(
          tabProgress.value,
          [0, 1],
          [FEED_SLIDE_UP_DISTANCE, 0],
        ),
      },
    ],
  }));
  const feedOpacityStyle = useAnimatedStyle(() => ({
    opacity: tabProgress.value,
  }));

  function handleMapTabChange(tab: MapTab): void {
    if (tab === mapTab) return;
    setMapTab(tab);

    if (tab === "feed") {
      if (feedMountTimerRef.current) {
        clearTimeout(feedMountTimerRef.current);
        feedMountTimerRef.current = null;
      }
      setHasFeedMounted(true);
      mapViewRef.current?.collapseSheet();
      tabProgress.value = withTiming(1, {
        duration: HOME_TAB_TRANSITION_DURATION,
        easing: Easing.bezier(0.45, 0.05, 0.55, 0.95),
      });
      setTabBarVariant("dark");
    } else {
      mapViewRef.current?.expandSheet();
      tabProgress.value = withTiming(0, {
        duration: HOME_TAB_TRANSITION_DURATION,
        easing: Easing.in(Easing.sin),
      });
      setTabBarVariant("light");
    }
  }

  function handleCloseSelected(): void {
    setCloseSelectedToken((prev) => prev + 1);
  }

  // 다른 화면에서 세모피드로 바로 이동해야 할 때 (예: 클라이브 둘러보기)
  useFocusEffect(
    useCallback(() => {
      if (tabParam === "feed") {
        handleMapTabChange("feed");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabParam]),
  );

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
        style={[{ top: -FEED_SLIDE_UP_DISTANCE }, feedAnimatedStyle]}
        pointerEvents={mapTab === "feed" ? "auto" : "none"}
      >
        {hasFeedMounted && <FeedHomeView />}
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
