import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export const SNAP_COLLAPSED = 68;
export const SNAP_DEFAULT = 360;
export const SNAP_EXPANDED = 600;

const SPRING = { damping: 28, stiffness: 280 };

function snapNearest(projected: number): number {
  'worklet';
  const snaps = [SNAP_COLLAPSED, SNAP_DEFAULT, SNAP_EXPANDED];
  return snaps.reduce((a, b) =>
    Math.abs(a - projected) < Math.abs(b - projected) ? a : b
  );
}

export type HomeBottomSheetRef = {
  collapseToMin: () => void;
};

type SnapState = 'collapsed' | 'default' | 'expanded';

type Props = {
  renderContent: (opts: { scrollEnabled: boolean; snapState: SnapState }) => React.ReactNode;
  heightSharedValue?: SharedValue<number>;
};

export const HomeBottomSheetContainer = forwardRef<HomeBottomSheetRef, Props>(
  function HomeBottomSheetContainer({ renderContent, heightSharedValue }, ref) {
    const internalHeight = useSharedValue(SNAP_DEFAULT);
    const height = heightSharedValue ?? internalHeight;
    const startH = useSharedValue(SNAP_DEFAULT);
    const [scrollEnabled, setScrollEnabled] = useState(false);
    const [snapState, setSnapState] = useState<SnapState>('default');

    useImperativeHandle(ref, () => ({
      collapseToMin: () => {
        height.value = withSpring(SNAP_COLLAPSED, SPRING);
        setScrollEnabled(false);
        setSnapState('collapsed');
      },
    }));

    const makePanGesture = (enabled: boolean) =>
      Gesture.Pan()
        .enabled(enabled)
        .onStart(() => {
          startH.value = height.value;
        })
        .onUpdate((e) => {
          height.value = Math.max(
            SNAP_COLLAPSED,
            Math.min(SNAP_EXPANDED, startH.value - e.translationY)
          );
        })
        .onEnd((e) => {
          const target = snapNearest(height.value - e.velocityY * 0.15);
          height.value = withSpring(target, SPRING);
          // 기본 높이(디폴트)에서는 스크롤 비활성, 최대 높이에서만 스크롤 활성
          runOnJS(setScrollEnabled)(target === SNAP_EXPANDED);
          runOnJS(setSnapState)(
            target === SNAP_COLLAPSED ? 'collapsed' : target === SNAP_EXPANDED ? 'expanded' : 'default'
          );
        });

    const handleGesture = makePanGesture(true);
    const bodyGesture = makePanGesture(!scrollEnabled);

    const animatedStyle = useAnimatedStyle(() => ({ height: height.value }));

    return (
      <Animated.View style={[styles.sheet, animatedStyle]}>
        {/* 드래그 핸들 - 항상 pan 제스처 */}
        <GestureDetector gesture={handleGesture}>
          <View style={styles.handle}>
            <View style={styles.handlePill} />
          </View>
        </GestureDetector>

        {/* 콘텐츠 - not expanded일 때 pan으로 확장, expanded일 때 스크롤 */}
        <GestureDetector gesture={bodyGesture}>
          <View style={styles.content}>
            {renderContent({ scrollEnabled, snapState })}
          </View>
        </GestureDetector>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handlePill: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});
