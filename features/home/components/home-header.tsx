import { BellIcon } from "@/components/icons/bell-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { SemosanLogo } from "@/components/icons/semosan-logo";
import { XIcon } from "@/components/icons/x-icon";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/use-unread-notification-count";
import { useRouter } from "expo-router";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MapTabToggle } from "./map-tab-toggle";

export type MapTab = "map" | "feed";

const buttonShadow = {
  boxShadow: '0px 2px 2px 0px rgba(0, 0, 0, 0.1)',
};

type HomeHeaderProps = {
  isMountainRecordListOpen: boolean;
  onCloseSelected: () => void;
  mapTab: MapTab;
  onMapTabChange: (tab: MapTab) => void;
  mapAnimatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
  feedAnimatedStyle: StyleProp<AnimatedStyle<ViewStyle>>;
};

export function HomeHeader({
  isMountainRecordListOpen,
  onCloseSelected,
  mapTab,
  onMapTabChange,
  mapAnimatedStyle,
  feedAnimatedStyle,
}: HomeHeaderProps) {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  return (
    <View className="absolute inset-x-0 top-0" pointerEvents="box-none">
      <View style={{ height: top }} />
      {isMountainRecordListOpen ? (
        <View className="h-14 flex-row items-center justify-between px-5">
          <Pressable
            onPress={onCloseSelected}
            className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
            style={buttonShadow}
            hitSlop={8}
          >
            <ChevronLeftIcon size={24} />
          </Pressable>
          <Pressable
            onPress={onCloseSelected}
            className="h-12 w-12 items-center justify-center rounded-full bg-fill-normal"
            style={buttonShadow}
            hitSlop={8}
          >
            <XIcon size={24} />
          </Pressable>
        </View>
      ) : (
        <>
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
            {/* 알림함 진입 — 로고와 같은 방식으로 지도/피드 모드 색 크로스페이드 */}
            <Pressable
              onPress={() => router.push("/notifications")}
              hitSlop={8}
              className="h-10 w-10 items-center justify-center"
            >
              <View style={{ width: 24, height: 24 }}>
                <Animated.View style={mapAnimatedStyle}>
                  <BellIcon size={24} color="#1A1B1F" />
                </Animated.View>
                <Animated.View
                  className="absolute left-0 top-0"
                  style={feedAnimatedStyle}
                >
                  <BellIcon size={24} color="#ffffff" />
                </Animated.View>
                {/* 안읽은 알림 뱃지 */}
                {unreadCount > 0 && (
                  <View
                    className="absolute rounded-full bg-status-negative"
                    style={{ top: 1, right: 1, width: 6, height: 6 }}
                  />
                )}
              </View>
            </Pressable>
          </View>
          <View className="mt-1 items-center">
            <MapTabToggle value={mapTab} onChange={onMapTabChange} />
          </View>
        </>
      )}
    </View>
  );
}
