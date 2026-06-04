import { SemoFeedResponse } from "@/types/api.generated";
import { memo } from "react";
import { Image, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { FadeInDown } from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";

export const CELL_CONTENT_W = 234;
export const CELL_CONTENT_H = 416;
export const CELL_GAP = 50;
export const CELL_W = CELL_CONTENT_W + CELL_GAP;
export const CELL_H = CELL_CONTENT_H + CELL_GAP;
export const MIN_COORD = -25;
export const MAX_COORD = 25;

type FeedCellProps = {
  col: number;
  row: number;
  item?: SemoFeedResponse;
  onPress: (item: SemoFeedResponse) => void;
};

export const FeedCell = memo(function FeedCell({
  col,
  row,
  item,
  onPress,
}: FeedCellProps) {
  const imageUrl = item?.imageUrl;

  const tap = Gesture.Tap().onEnd(() => {
    if (item) runOnJS(onPress)(item);
  });

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(200)}
      className="absolute overflow-hidden rounded-2xl bg-transparent"
      style={{
        left: col * CELL_W + CELL_GAP / 2,
        top: row * CELL_H + CELL_GAP / 2 - (col % 2 !== 0 ? 60 : 0),
        width: CELL_CONTENT_W,
        height: CELL_CONTENT_H,
      }}
    >
      <GestureDetector gesture={tap}>
        <View style={{ flex: 1 }}>
          {imageUrl && (
            <Image
              // TODO: 백엔드에서 URL에 큰따옴표 포함 저장 현상 수정되면 replace 로직 제거
              source={{ uri: imageUrl.replace(/"/g, "") }}
              className="absolute inset-0 h-full w-full"
              resizeMode="cover"
            />
          )}
        </View>
      </GestureDetector>
    </Animated.View>
  );
});
