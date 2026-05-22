import { memo, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// ─────────────────────────────────────────────
// 상수
// ─────────────────────────────────────────────
const CELL_CONTENT_W = 234;
const CELL_CONTENT_H = 416;
const CELL_GAP = 50;
const CELL_W = CELL_CONTENT_W + CELL_GAP; // 셀 stride (위치 계산용)
const CELL_H = CELL_CONTENT_H + CELL_GAP;
const OVERSCAN = 2; // 화면 밖 여유분 (셀 단위)
const MIN_COORD = -25; // 그리드 경계
const MAX_COORD = 25;

function cellImageUrl(col: number, row: number): string {
  const seed = ((col - MIN_COORD) * 51 + (row - MIN_COORD)) % 1000;
  return `https://picsum.photos/seed/${seed}/320/200`;
}

// ─────────────────────────────────────────────
// 셀 컴포넌트 (memo로 불필요한 리렌더 방지)
// ─────────────────────────────────────────────
const Cell = memo(function Cell({
  col,
  row,
}: {
  col: number;
  row: number;
}): React.ReactElement {
  return (
    <View
      className="absolute overflow-hidden rounded-xl bg-[#1a1a1a]"
      style={{
        left: col * CELL_W + CELL_GAP / 2,
        top: row * CELL_H + CELL_GAP / 2 - (col % 2 !== 0 ? 60 : 0),
        width: CELL_CONTENT_W,
        height: CELL_CONTENT_H,
      }}
    >
      <Image
        source={{ uri: cellImageUrl(col, row) }}
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
      />
      <Text className="absolute bottom-3 left-3 font-mono text-[11px] text-white/70">
        ({col}, {row})
      </Text>
    </View>
  );
});

// ─────────────────────────────────────────────
// 메인 그리드
// ─────────────────────────────────────────────
export function FeedHomeView() {
  // 화면 크기 (onLayout으로 측정)
  const [screen, setScreen] = useState({ w: 0, h: 0 });

  // JS 스레드 state: 가상화 계산용
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // UI 스레드 shared value: transform 갱신용
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // 제스처 시작 시점의 누적값 (Pan은 매번 0부터 시작하므로)
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  // rAF 스로틀용
  const rafRef = useRef<number | null>(null);

  // ─────────────────────────────────────────────
  // rAF 스로틀: setOffset을 프레임당 1번으로 묶음
  // ─────────────────────────────────────────────
  const scheduleSetOffset = (x: number, y: number): void => {
    if (rafRef.current != null) return; // 이미 예약돼 있으면 무시
    rafRef.current = requestAnimationFrame(() => {
      setOffset({ x, y });
      rafRef.current = null;
    });
  };

  // translateX/Y 변화 감지 → offset 업데이트 (pan + 관성 모두 커버)
  useAnimatedReaction(
    () => ({ x: translateX.value, y: translateY.value }),
    (current) => {
      scheduleOnRN(scheduleSetOffset, current.x, current.y);
    },
  );

  // ─────────────────────────────────────────────
  // Pan 제스처
  // ─────────────────────────────────────────────
  const pan = Gesture.Pan()
    .onBegin(() => {
      // 관성 애니메이션 중 새 제스처가 시작되면 현재 위치부터 시작
      savedX.value = translateX.value;
      savedY.value = translateY.value;
    })
    .onUpdate((e) => {
      // ★ UI 스레드: transform 즉시 갱신 (60fps 부드러움)
      translateX.value = savedX.value + e.translationX;
      translateY.value = savedY.value + e.translationY;
    })
    .onEnd((e) => {
      // ★ 관성: 손가락을 뗀 속도로 감속 애니메이션
      translateX.value = withDecay({ velocity: e.velocityX });
      translateY.value = withDecay({ velocity: e.velocityY });
    });

  // ─────────────────────────────────────────────
  // transform 스타일 (UI 스레드에서 매 프레임 갱신)
  // ─────────────────────────────────────────────
  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  // ─────────────────────────────────────────────
  // 가상화: 화면에 보일 셀 범위 계산
  // ─────────────────────────────────────────────
  const cells: React.ReactElement[] = [];

  if (screen.w > 0 && screen.h > 0) {
    // "지금 화면 왼쪽 위가 그리드의 어느 픽셀 지점인가"
    // = transform이 왼쪽으로 200 밀면 → 화면 왼쪽 위는 그리드의 +200 지점
    const viewLeft = -offset.x;
    const viewTop = -offset.y;

    const colStart = Math.floor(viewLeft / CELL_W) - OVERSCAN;
    const colEnd = Math.ceil((viewLeft + screen.w) / CELL_W) + OVERSCAN;
    const rowStart = Math.floor(viewTop / CELL_H) - OVERSCAN;
    const rowEnd = Math.ceil((viewTop + screen.h) / CELL_H) + OVERSCAN;

    for (let c = colStart; c <= colEnd; c++) {
      if (c < MIN_COORD || c > MAX_COORD) continue; // 그리드 경계 clamp
      for (let r = rowStart; r <= rowEnd; r++) {
        if (r < MIN_COORD || r > MAX_COORD) continue;
        cells.push(<Cell key={`${c},${r}`} col={c} row={r} />);
      }
    }
  }

  // ─────────────────────────────────────────────
  // 렌더
  // ─────────────────────────────────────────────
  return (
    <GestureDetector gesture={pan}>
      <View
        className="flex-1 overflow-hidden bg-[#111]"
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setScreen({ w: width, h: height });
          // (0,0) 셀 중심이 화면 중앙에 오도록
          // 셀(0,0) 중심의 그리드 좌표 = CELL_GAP/2 + CELL_CONTENT_W/2 = CELL_W/2
          const initX = width / 2 - CELL_W / 2;
          const initY = height / 2 - CELL_H / 2;
          translateX.value = initX;
          translateY.value = initY;
          savedX.value = initX;
          savedY.value = initY;
          setOffset({ x: initX, y: initY });
        }}
      >
        <Animated.View className="absolute inset-0" style={animStyle}>
          {cells}
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
