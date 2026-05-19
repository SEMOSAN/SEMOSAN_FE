import { useToastStore } from "@/store/toast.store";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import { Path, Svg } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ENTER_MS = 200;
const EXIT_MS = 160;

// 토스트 레이아웃 상수
const TOAST_HEIGHT = 48;
const TOAST_PADDING_V = 10;
const TOAST_PADDING_H = 16;
const TOAST_GAP = 8;
const TOAST_BORDER_RADIUS = 12; // radius-xl
const TOAST_LEFT = 70;
const TOAST_BOTTOM = 54;
const TOAST_BG = '#2F323A';       // fill-heavy
const TOAST_TEXT_COLOR = '#FFFFFF'; // label-normal-inverse

function CheckCircleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M13.5672 7.68281C13.6253 7.74086 13.6714 7.80979 13.7029 7.88566C13.7343 7.96154 13.7505 8.04287 13.7505 8.125C13.7505 8.20713 13.7343 8.28846 13.7029 8.36434C13.6714 8.44021 13.6253 8.50914 13.5672 8.56719L9.19219 12.9422C9.13415 13.0003 9.06522 13.0464 8.98934 13.0779C8.91347 13.1093 8.83214 13.1255 8.75 13.1255C8.66787 13.1255 8.58654 13.1093 8.51067 13.0779C8.43479 13.0464 8.36586 13.0003 8.30782 12.9422L6.43282 11.0672C6.31554 10.9499 6.24966 10.7909 6.24966 10.625C6.24966 10.4591 6.31554 10.3001 6.43282 10.1828C6.55009 10.0655 6.70915 9.99965 6.875 9.99965C7.04086 9.99965 7.19992 10.0655 7.31719 10.1828L8.75 11.6164L12.6828 7.68281C12.7409 7.6247 12.8098 7.5786 12.8857 7.54715C12.9615 7.5157 13.0429 7.49951 13.125 7.49951C13.2071 7.49951 13.2885 7.5157 13.3643 7.54715C13.4402 7.5786 13.5091 7.6247 13.5672 7.68281ZM18.125 10C18.125 11.607 17.6485 13.1779 16.7557 14.514C15.8629 15.8502 14.594 16.8916 13.1093 17.5065C11.6247 18.1215 9.99099 18.2824 8.41489 17.9689C6.8388 17.6554 5.39106 16.8815 4.25476 15.7452C3.11846 14.6089 2.34463 13.1612 2.03112 11.5851C1.71762 10.009 1.87852 8.37535 2.49348 6.8907C3.10844 5.40605 4.14985 4.1371 5.486 3.24431C6.82214 2.35152 8.39303 1.875 10 1.875C12.1542 1.87727 14.2195 2.73403 15.7427 4.25727C17.266 5.78051 18.1227 7.84581 18.125 10ZM16.875 10C16.875 8.64025 16.4718 7.31104 15.7164 6.18045C14.9609 5.04987 13.8872 4.16868 12.631 3.64833C11.3747 3.12798 9.99238 2.99183 8.65876 3.2571C7.32514 3.52237 6.10013 4.17715 5.13864 5.13864C4.17716 6.10013 3.52238 7.32513 3.2571 8.65875C2.99183 9.99237 3.12798 11.3747 3.64833 12.6309C4.16868 13.8872 5.04987 14.9609 6.18046 15.7164C7.31105 16.4718 8.64026 16.875 10 16.875C11.8227 16.8729 13.5702 16.1479 14.8591 14.8591C16.1479 13.5702 16.8729 11.8227 16.875 10Z"
        fill="white"
      />
    </Svg>
  );
}

type Props = {
  containerClassName?: string;
  gap?: number;
};

export default function Toast({ containerClassName, gap = 8 }: Props) {
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
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: TOAST_LEFT,
        bottom: insets.bottom + TOAST_BOTTOM,
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY }],
        }}
      >
        <View
          style={{
            height: TOAST_HEIGHT,
            flexDirection: 'row',
            alignItems: 'center',
            gap: TOAST_GAP,
            paddingVertical: TOAST_PADDING_V,
            paddingHorizontal: TOAST_PADDING_H,
            borderRadius: TOAST_BORDER_RADIUS,
            backgroundColor: TOAST_BG,
          }}
        >
          <CheckCircleIcon />
          <Text
            style={{ color: TOAST_TEXT_COLOR, letterSpacing: -0.16 }}
            className="typo-body-1-normal-regular"
          >
            {current.message}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
