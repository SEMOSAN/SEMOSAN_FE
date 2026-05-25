import { LayoutChangeEvent, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

const THUMB_SHADOW = {
  boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
} as const;

type Props = {
  min: number;
  max: number;
  low: number;
  high: number;
  step?: number;
  onValueChange: (low: number, high: number) => void;
  filledTrackColor?: string;
};

export function RangeSlider({
  min,
  max,
  low,
  high,
  step = 1,
  onValueChange,
  filledTrackColor = '#22C55E',
}: Props) {
  const containerWidth = useSharedValue(0);
  const lowPos = useSharedValue((low - min) / (max - min));
  const highPos = useSharedValue((high - min) / (max - min));
  const startLow = useSharedValue(0);
  const startHigh = useSharedValue(0);

  const minGap = step / (max - min);

  const clamp = (val: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, val));

  const snap = (pos: number): number => {
    const steps = (max - min) / step;
    return Math.round(pos * steps) / steps;
  };

  const posToValue = (pos: number): number =>
    parseFloat((min + snap(pos) * (max - min)).toFixed(1));

  const lowGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      startLow.value = lowPos.value;
    })
    .onUpdate((e) => {
      if (containerWidth.value === 0) return;
      const usable = containerWidth.value - THUMB_SIZE;
      const next = clamp(startLow.value + e.translationX / usable, 0, highPos.value - minGap);
      lowPos.value = next;
      onValueChange(posToValue(next), posToValue(highPos.value));
    });

  const highGesture = Gesture.Pan()
    .runOnJS(true)
    .onBegin(() => {
      startHigh.value = highPos.value;
    })
    .onUpdate((e) => {
      if (containerWidth.value === 0) return;
      const usable = containerWidth.value - THUMB_SIZE;
      const next = clamp(startHigh.value + e.translationX / usable, lowPos.value + minGap, 1);
      highPos.value = next;
      onValueChange(posToValue(lowPos.value), posToValue(next));
    });

  const filledStyle = useAnimatedStyle(() => {
    const usable = containerWidth.value - THUMB_SIZE;
    return {
      left: THUMB_SIZE / 2 + lowPos.value * usable,
      width: (highPos.value - lowPos.value) * usable,
    };
  });

  const lowThumbStyle = useAnimatedStyle(() => ({
    left: lowPos.value * (containerWidth.value - THUMB_SIZE),
  }));

  const highThumbStyle = useAnimatedStyle(() => ({
    left: highPos.value * (containerWidth.value - THUMB_SIZE),
  }));

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
  };

  return (
    <View
      className="relative w-full"
      style={{ height: THUMB_SIZE }}
      onLayout={handleLayout}
    >
      {/* 트랙 배경 */}
      <View
        className="absolute rounded-full bg-line-subtle"
        style={{
          left: THUMB_SIZE / 2,
          right: THUMB_SIZE / 2,
          height: TRACK_HEIGHT,
          top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
        }}
      />

      {/* 채워진 트랙 */}
      <Animated.View
        className="absolute rounded-full"
        style={[
          {
            height: TRACK_HEIGHT,
            top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
            backgroundColor: filledTrackColor,
          },
          filledStyle,
        ]}
      />

      {/* Low thumb */}
      <GestureDetector gesture={lowGesture}>
        <Animated.View
          className="absolute bg-white rounded-full"
          style={[{ width: THUMB_SIZE, height: THUMB_SIZE, top: 0 }, THUMB_SHADOW, lowThumbStyle]}
        />
      </GestureDetector>

      {/* High thumb */}
      <GestureDetector gesture={highGesture}>
        <Animated.View
          className="absolute bg-white rounded-full"
          style={[{ width: THUMB_SIZE, height: THUMB_SIZE, top: 0 }, THUMB_SHADOW, highThumbStyle]}
        />
      </GestureDetector>
    </View>
  );
}
