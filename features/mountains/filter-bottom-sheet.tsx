import { ReactNode, useEffect, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

const OPEN_CONFIG = { duration: 320, easing: Easing.out(Easing.cubic) };
const CLOSE_CONFIG = { duration: 250, easing: Easing.in(Easing.cubic) };
const SNAP_BACK_SPRING = { damping: 20, stiffness: 300 };
const DISMISS_THRESHOLD = 100;
const CLOSE_DURATION = CLOSE_CONFIG.duration;

export function FilterBottomSheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();
  // 닫힘 애니메이션이 끝난 뒤 Modal을 언마운트하기 위한 내부 상태
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(600);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      translateY.value = withTiming(0, OPEN_CONFIG);
      backdropOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [visible, translateY, backdropOpacity]);

  // 순수 JS 함수 — runOnJS 대상으로 사용 (shared value 접근 없음)
  const afterDismiss = () => {
    setTimeout(() => {
      setModalVisible(false);
      onClose();
    }, CLOSE_DURATION + 10);
  };

  // JS 스레드에서 직접 호출 (backdrop 탭, Android 백버튼)
  const handleDismiss = () => {
    translateY.value = withTiming(600, CLOSE_CONFIG);
    backdropOpacity.value = withTiming(0, { duration: 200 });
    afterDismiss();
  };

  // .runOnJS(true): 콜백을 JS 스레드에서 실행 → runOnJS 래퍼 불필요
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD) {
        translateY.value = withTiming(600, CLOSE_CONFIG);
        backdropOpacity.value = withTiming(0, { duration: 200 });
        afterDismiss();
      } else {
        translateY.value = withSpring(0, SNAP_BACK_SPRING);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      {/* Modal은 별도 네이티브 뷰 계층에 렌더링되므로 GestureHandlerRootView를 직접 감싸야 함 */}
      <GestureHandlerRootView className="flex-1">
        {/* Backdrop */}
        <Animated.View
          className="absolute inset-0"
          style={[{ backgroundColor: 'rgba(0,0,0,0.2)' }, backdropStyle]}
        >
          <Pressable className="absolute inset-0" onPress={handleDismiss} />
        </Animated.View>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute bottom-0 left-0 right-0 bg-fill-normal rounded-tl-[20px] rounded-tr-[20px] overflow-hidden"
            style={[{ paddingBottom: insets.bottom }, sheetStyle]}
          >
            {/* Drag handle */}
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-line-subtle" />
            </View>

            {/* Title */}
            <View className="px-5 pt-3 pb-1">
              <Text className="typo-body-2-normal-medium text-label-subtle">{title}</Text>
            </View>

            {children}
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
