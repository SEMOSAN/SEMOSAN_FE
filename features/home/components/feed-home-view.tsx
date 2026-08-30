import { ResetIcon } from "@/components/icons/reset-icon";
import { SemoFeedResponse } from "@/types/api.generated";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { FEED_SLIDE_UP_DISTANCE } from "../constants";
import { useSemofeed } from "../hooks/use-semofeed";
import { CELL_H, CELL_W, FeedCell } from "./feed-cell";
import { FeedCellDetail } from "./feed-cell-detail";

// (0,0)을 중심으로 시계방향 나선형 순서의 인덱스를 반환
// 순서: (0,0)→(0,1)→(1,1)→(1,0)→(1,-1)→(0,-1)→(-1,-1)→(-1,0)→(-1,1)→...
function getSpiralIndex(col: number, row: number): number {
  if (col === 0 && row === 0) return 0;
  const n = Math.max(Math.abs(col), Math.abs(row));
  const startIndex = 1 + 4 * n * (n - 1);
  let posInRing: number;
  if (row === n && col > -n) {
    posInRing = col + n - 1;
  } else if (col === n) {
    posInRing = 2 * n + (n - 1 - row);
  } else if (row === -n) {
    posInRing = 4 * n + (n - 1 - col);
  } else {
    posInRing = 7 * n - 1 + row;
  }
  return startIndex + posInRing;
}

const OVERSCAN = 1; // 화면 밖 여유분 (셀 단위)

// ─────────────────────────────────────────────
// 메인 그리드
// ─────────────────────────────────────────────
export function FeedHomeView() {
  const {
    data: semofeedData,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSemofeed();

  const feedItems = semofeedData?.pages.flatMap((p) => p.content ?? []) ?? [];

  const prefetchedUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    const urls = (semofeedData?.pages.flatMap((p) => p.content ?? []) ?? [])
      .map((item) => item.imageUrl?.replace(/"/g, ""))
      .filter(
        (url): url is string => !!url && !prefetchedUrlsRef.current.has(url),
      );
    if (urls.length > 0) {
      urls.forEach((url) => prefetchedUrlsRef.current.add(url));
      Image.prefetch(urls, { cachePolicy: "memory-disk" });
    }
  }, [semofeedData]);

  // 화면 크기 (onLayout으로 측정)
  const [screen, setScreen] = useState({ w: 0, h: 0 });

  // JS 스레드 state: 가상화 계산용
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [selectedItem, setSelectedItem] = useState<SemoFeedResponse | null>(null);

  // UI 스레드 shared value: transform 갱신용
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // 제스처 시작 시점의 누적값 (Pan은 매번 0부터 시작하므로)
  const savedX = useSharedValue(0);
  const savedY = useSharedValue(0);

  // 초기 중심 위치 저장 (리셋 버튼용)
  const initPosRef = useRef({ x: 0, y: 0 });

  // 첫 진입 연출이 끝났는지 (이후 드러나는 셀은 등장 애니메이션 생략)
  const introPlayedRef = useRef(false);

  // rAF 스로틀용
  const rafRef = useRef<number | null>(null);
  const pendingOffsetRef = useRef({ x: 0, y: 0 });
  const lastBucketRef = useRef({ x: 0, y: 0 });

  // ─────────────────────────────────────────────
  // rAF 스로틀: setOffset을 프레임당 최대 1번으로 묶고,
  // 가시 셀 범위가 바뀔 만큼(반 셀) 움직였을 때만 리렌더
  // ─────────────────────────────────────────────
  const scheduleSetOffset = (x: number, y: number): void => {
    pendingOffsetRef.current = { x, y };
    if (rafRef.current != null) return; // 이미 예약돼 있으면 무시
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const { x: px, y: py } = pendingOffsetRef.current;
      // OVERSCAN 1셀 여유가 있으므로 반 셀 단위 이동 전까지는 범위 재계산 불필요
      const bucketX = Math.round(px / (CELL_W / 2));
      const bucketY = Math.round(py / (CELL_H / 2));
      const last = lastBucketRef.current;
      if (bucketX === last.x && bucketY === last.y) return;
      lastBucketRef.current = { x: bucketX, y: bucketY };
      setOffset({ x: px, y: py });
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
  // Pan 제스처 (디테일 열려있으면 비활성)
  // ─────────────────────────────────────────────
  const pan = Gesture.Pan()
    .enabled(selectedItem === null)
    // 8px 이상 움직여야 Pan 활성화 → 그 전엔 Tap이 우선
    .activeOffsetX([-8, 8])
    .activeOffsetY([-8, 8])
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
  // 뷰포트가 현재 로드된 나선의 가장 바깥 링에 닿았는지 (다음 페이지 로드 트리거)
  let touchesEdge = false;

  if (screen.w > 0 && screen.h > 0) {
    // "지금 화면 왼쪽 위가 그리드의 어느 픽셀 지점인가"
    // = transform이 왼쪽으로 200 밀면 → 화면 왼쪽 위는 그리드의 +200 지점
    const viewLeft = -offset.x;
    const viewTop = -offset.y;

    const colStart = Math.floor(viewLeft / CELL_W) - OVERSCAN;
    const colEnd = Math.ceil((viewLeft + screen.w) / CELL_W) + OVERSCAN;
    const rowStart = Math.floor(viewTop / CELL_H) - OVERSCAN;
    const rowEnd = Math.ceil((viewTop + screen.h) / CELL_H) + OVERSCAN;

    const maxRing =
      feedItems.length > 0
        ? Math.ceil((Math.sqrt(feedItems.length) - 1) / 2)
        : 0;

    touchesEdge =
      Math.max(
        Math.abs(colStart),
        Math.abs(colEnd),
        Math.abs(rowStart),
        Math.abs(rowEnd),
      ) >= maxRing;

    for (let col = colStart; col <= colEnd; col++) {
      if (Math.abs(col) > maxRing) continue;
      for (let row = rowStart; row <= rowEnd; row++) {
        if (Math.abs(row) > maxRing) continue;
        const spiralIdx = getSpiralIndex(col, row);
        if (spiralIdx >= feedItems.length) continue;
        cells.push(
          <FeedCell
            key={`${col},${row}`}
            col={col}
            row={row}
            item={feedItems[spiralIdx]}
            onPress={setSelectedItem}
            animated={!introPlayedRef.current}
          />,
        );
      }
    }
  }

  // 뷰포트가 로드된 영역의 가장자리에 닿으면 다음 페이지 로드
  useEffect(() => {
    if (touchesEdge && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [touchesEdge, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // ─────────────────────────────────────────────
  // 렌더
  // ─────────────────────────────────────────────
  return (
    <>
      <GestureDetector gesture={pan}>
        <View
          className="flex-1 overflow-hidden bg-[#111]"
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setScreen({ w: width, h: height });
            // (0,0) 셀 중심이 화면 중앙에 오도록
            // 셀(0,0) 중심의 그리드 좌표 = CELL_GAP/2 + CELL_CONTENT_W/2 = CELL_W/2
            const initX = width / 2 - CELL_W / 2;
            const initY = height / 2 - CELL_H / 2 + FEED_SLIDE_UP_DISTANCE / 2;
            initPosRef.current = { x: initX, y: initY };
            translateX.value = initX;
            translateY.value = initY;
            savedX.value = initX;
            savedY.value = initY;
            lastBucketRef.current = {
              x: Math.round(initX / (CELL_W / 2)),
              y: Math.round(initY / (CELL_H / 2)),
            };
            setOffset({ x: initX, y: initY });
            if (!introPlayedRef.current) {
              setTimeout(() => {
                introPlayedRef.current = true;
              }, 600);
            }
          }}
        >
          {/* 배경 이미지 */}
          <Image
            source={require("@/assets/images/blur-feed-bg.png")}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            priority="low"
          />
          <Animated.View className="absolute inset-0" style={animStyle}>
            {cells}
          </Animated.View>
        </View>
      </GestureDetector>

      <Pressable
        className="absolute bottom-3 right-3 items-center justify-center rounded-full bg-label-normal px-4 py-[13px]"
        style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.1)" }}
        hitSlop={8}
        onPress={() => {
          refetch();
          const { x, y } = initPosRef.current;
          translateX.value = withSpring(x);
          translateY.value = withSpring(y);
        }}
      >
        <ResetIcon size={24} color="#ffffff" />
      </Pressable>

      {selectedItem !== null && (
        <FeedCellDetail
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
