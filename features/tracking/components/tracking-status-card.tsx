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

function PlayIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5Z"
        fill={colors.label.normal}
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
  /** 일시 정지 중 기록 종료. 일시 정지 디자인이 나오기 전까지의 임시 자리 */
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
        <View className="flex-row items-center gap-2">
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
        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-xl bg-fill-stronger"
          onPress={isPaused ? onResume : onPause}
          accessibilityLabel={isPaused ? "다시 시작" : "일시 정지"}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </TouchableOpacity>
      </View>

      {/* TODO: 일시 정지 디자인이 나오면 교체 */}
      {isPaused && (
        <TouchableOpacity
          className="h-11 items-center justify-center rounded-[10px] bg-fill-stronger"
          onPress={onStop}
        >
          <Text className="text-label-subtle typo-label-large">기록 종료</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
