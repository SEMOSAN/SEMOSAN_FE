import { CaretDownIcon } from "@/components/icons/caret-down-icon";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  isOpen?: boolean;
  isActive?: boolean;
  count?: number;
  onPress?: () => void;
};

export function FilterChip({
  label,
  isOpen,
  isActive,
  count,
  onPress,
}: Props): React.JSX.Element {
  const rotation = useDerivedValue(() =>
    withTiming(isOpen ? 180 : 0, { duration: 250 }),
  );

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${
        isActive
          ? "border-fill-heavy bg-fill-heavy"
          : "border-line-subtle bg-fill-normal"
      }`}
    >
      <Text
        className={`typo-body-3-semi-bold ${
          isActive ? "text-label-normal-inverse" : "text-label-normal"
        }`}
      >
        {label}
      </Text>
      {isActive && count !== undefined && count > 0 && (
        <Text className="text-green-400 typo-body-3-semi-bold">{count}</Text>
      )}
      <Animated.View style={iconStyle}>
        <CaretDownIcon color={isActive ? "#D1D5DB" : "#1A1B1F"} />
      </Animated.View>
    </TouchableOpacity>
  );
}
