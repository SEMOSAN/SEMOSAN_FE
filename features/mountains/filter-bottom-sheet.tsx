import { ReactNode, useEffect, useState } from "react";
import {
  Keyboard,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
const MODAL_UNMOUNT_DELAY = CLOSE_DURATION + 10;

export function FilterBottomSheet({
  visible,
  onClose,
  title,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  // 닫힘 애니메이션이 끝난 뒤 Modal을 언마운트하기 위한 내부 상태
  const [modalVisible, setModalVisible] = useState(false);
  const translateY = useSharedValue(600);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // visible이 true가 되면 Modal을 마운트하고 열림 애니메이션 실행
      setModalVisible(true);
      translateY.value = withTiming(0, OPEN_CONFIG);
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else if (modalVisible) {
      // visible이 외부에서 false로 바뀐 경우 닫힘 애니메이션 실행.
      // 애니메이션이 끝난 뒤 Modal을 언마운트해야 하므로
      // MODAL_UNMOUNT_DELAY 후에 setModalVisible(false) 호출.
      translateY.value = withTiming(600, CLOSE_CONFIG);
      backdropOpacity.value = withTiming(0, { duration: 200 });
      const timer = setTimeout(() => setModalVisible(false), MODAL_UNMOUNT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // 순수 JS 함수 — runOnJS 대상으로 사용 (shared value 접근 없음)
  const afterDismiss = () => {
    onClose();
    setTimeout(() => {
      setModalVisible(false);
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
          style={[{ backgroundColor: "rgba(0,0,0,0.2)" }, backdropStyle]}
        >
          <Pressable className="absolute inset-0" onPress={handleDismiss} />
        </Animated.View>

        {/* Sheet */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            className="absolute bottom-0 left-0 right-0 overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-fill-normal"
            style={[{ paddingBottom: insets.bottom }, sheetStyle]}
          >
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View>
                {/* Drag handle */}
                <View className="items-center pb-1 pt-3">
                  <View className="h-1 w-10 rounded-full bg-line-subtle" />
                </View>

                {/* Title */}
                <View className="px-5 pb-1 pt-3">
                  <Text className="text-label-subtle typo-body-2-normal-medium">
                    {title}
                  </Text>
                </View>

                {children}
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}
