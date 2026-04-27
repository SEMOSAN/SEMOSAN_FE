import { useToastStore } from "@/store/toast.store";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ENTER_MS = 200;
const EXIT_MS = 160;

type Props = {
  containerClassName?: string;
  gap?: number;
};

export default function ToastHost({ containerClassName, gap = 8 }: Props) {
  const { queue, current, setCurrent } = useToastStore();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const timer = useRef<number | null>(null);

  const insets = useSafeAreaInsets();

  // 큐 소비
  useEffect(() => {
    if (!current && queue.length > 0) setCurrent(queue[0]);
  }, [queue, current, setCurrent]);

  // 표시/오토닫힘
  useEffect(() => {
    if (!current) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ENTER_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: ENTER_MS,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(hide, current.duration);

    return () => {
      timer.current && clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const hide = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: EXIT_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 10,
        duration: EXIT_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      useToastStore.getState().setCurrent(null);
      useToastStore.getState().shift();
    });
  };

  if (!current) return null;

  return (
    <View
      pointerEvents="box-none"
      className={`absolute bottom-[100px] left-0 right-0 z-[9999] items-center ${containerClassName ? ` ${containerClassName}` : ""}`}
    >
      <Animated.View
        className="mx-5 self-stretch"
        style={{
          opacity,
          transform: [{ translateY }],
          marginTop: insets.top + gap,
          marginBottom: gap,
        }}
      >
        {/* TODO : 토스트 디자인 나오면 변경 필요. */}
        <Text>{current.message}</Text>
      </Animated.View>
    </View>
  );
}
