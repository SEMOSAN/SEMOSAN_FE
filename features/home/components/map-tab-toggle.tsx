import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export type MapTab = "map" | "feed";

type MapTabToggleProps = {
  value: MapTab;
  onChange: (tab: MapTab) => void;
};

const TOGGLE_WIDTH = 171;
const PADDING = 2;
const INDICATOR_WIDTH = (TOGGLE_WIDTH - PADDING * 2) / 2;

export function MapTabToggle({ value, onChange }: MapTabToggleProps): React.JSX.Element {
  const translateX = useSharedValue(value === "feed" ? INDICATOR_WIDTH : 0);

  useEffect(() => {
    translateX.value = withTiming(value === "feed" ? INDICATOR_WIDTH : 0, { duration: 200 });
  }, [value]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="h-[39px] w-[171px] rounded-full bg-[#2F323A]" style={{ padding: PADDING }}>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: PADDING,
            left: PADDING,
            width: INDICATOR_WIDTH,
            bottom: PADDING,
            borderRadius: 999,
            backgroundColor: "#FFFFFF",
          },
          indicatorStyle,
        ]}
      />
      <View className="flex-1 flex-row">
        {(["map", "feed"] as const).map((tab) => (
          <Pressable
            key={tab}
            className="flex-1 items-center justify-center"
            onPress={() => onChange(tab)}
          >
            <Text
              className={value === tab ? "text-label-normal" : "text-line-subtle"}
              style={{ fontFamily: "Pretendard", fontSize: 15, fontWeight: "600" }}
            >
              {tab === "map" ? "정복 지도" : "세모피드"}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
