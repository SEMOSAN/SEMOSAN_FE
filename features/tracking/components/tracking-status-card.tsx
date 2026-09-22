import { colors } from "@/constants/colors";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import {
  Course,
  DIFFICULTY_BG,
  DIFFICULTY_TEXT_COLOR,
  SHADOW,
} from "../constants";
import { ElapsedTime } from "./elapsed-time";
import type { RefObject } from "react";

// 디자인 스펙 값 — 토큰에 없는 색
const COURSE_DIVIDER = "rgba(192, 192, 192, 0.2)";

function PauseIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Rect
        x={3}
        y={2}
        width={4}
        height={12}
        rx={1.5}
        fill={colors.label.normal}
      />
      <Rect
        x={9}
        y={2}
        width={4}
        height={12}
        rx={1.5}
        fill={colors.label.normal}
      />
    </Svg>
  );
}

function StopIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
      <Path
        d="M15 0H1.5C1.10218 0 0.720644 0.158035 0.43934 0.43934C0.158035 0.720644 0 1.10218 0 1.5V15C0 15.3978 0.158035 15.7794 0.43934 16.0607C0.720644 16.342 1.10218 16.5 1.5 16.5H15C15.3978 16.5 15.7794 16.342 16.0607 16.0607C16.342 15.7794 16.5 15.3978 16.5 15V1.5C16.5 1.10218 16.342 0.720644 16.0607 0.43934C15.7794 0.158035 15.3978 0 15 0Z"
        fill={colors.label.subtle}
      />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <Svg width={15} height={17} viewBox="0 0 15 17" fill="none">
      <Path
        d="M0 15.4692V1.00154C0 0.224247 0.847972 -0.255865 1.5145 0.14405L13.5708 7.37786C14.2182 7.76626 14.2182 8.70444 13.5708 9.09284L1.5145 16.3267C0.847971 16.7266 0 16.2465 0 15.4692Z"
        fill={colors.label.subtle}
      />
    </Svg>
  );
}

type Props = {
  /** 따라가는 코스. 자유 기록이면 null */
  course: Course | null;
  elapsedSecondsRef: RefObject<number>;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  /** 일시 정지 중 기록 종료(■) */
  onStop: () => void;
};

/** 트래킹 중 하단에 떠 있는 상태 카드 — 코스명 · 등산 시간 · 일시 정지 */
export function TrackingStatusCard({
  course,
  elapsedSecondsRef,
  isPaused,
  onPause,
  onResume,
  onStop,
}: Props) {
  return (
    <View
      className="mx-4 gap-4 rounded-2xl bg-fill-normal px-4 py-4"
      style={SHADOW}
    >
      {course && (
        <View
          className="flex-row items-center gap-2 pb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: COURSE_DIVIDER }}
        >
          <View
            className={`rounded px-1.5 py-0.5 ${DIFFICULTY_BG[course.difficulty]}`}
          >
            <Text
              className={`typo-caption-1-semi-bold ${DIFFICULTY_TEXT_COLOR[course.difficulty]}`}
            >
              {course.difficulty}
            </Text>
          </View>
          <Text
            className="typo-label-normal flex-1 text-label-normal"
            numberOfLines={1}
          >
            {course.name}
          </Text>
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-label-subtler typo-caption-1-medium">
            등산 시간
          </Text>
          <ElapsedTime secondsRef={elapsedSecondsRef} running={!isPaused} />
        </View>
        {isPaused ? (
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-[10px] bg-fill-stronger"
              onPress={onStop}
              accessibilityLabel="기록 종료"
            >
              <StopIcon />
            </TouchableOpacity>
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-[10px] bg-secondary-normal"
              onPress={onResume}
              accessibilityLabel="다시 시작"
            >
              <PlayIcon />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className="h-12 w-12 items-center justify-center rounded-[10px] bg-fill-stronger"
            onPress={onPause}
            accessibilityLabel="일시 정지"
          >
            <PauseIcon />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
