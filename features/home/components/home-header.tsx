import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { SemosanLogo } from "@/components/icons/semosan-logo";
import { XIcon } from "@/components/icons/x-icon";
import { MapTabToggle } from "./map-tab-toggle";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type MapTab = "map" | "feed";

const buttonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
};

type HomeHeaderProps = {
  isMountainRecordListOpen: boolean;
  onCloseSelected: () => void;
  mapTab: MapTab;
  onMapTabChange: (tab: MapTab) => void;
  mapAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  feedAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
};

export function HomeHeader({
  isMountainRecordListOpen,
  onCloseSelected,
  mapTab,
  onMapTabChange,
  mapAnimatedStyle,
  feedAnimatedStyle,
}: HomeHeaderProps): JSX.Element {
  const { top } = useSafeAreaInsets();

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
          </View>
          <View className="mt-1 items-center">
            <MapTabToggle value={mapTab} onChange={onMapTabChange} />
          </View>
        </>
      )}
    </View>
  );
}
