import { MountainChipIcon } from "@/components/icons/mountain-chip-icon";
import { memo } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export const CELL_CONTENT_W = 234;
export const CELL_CONTENT_H = 416;
export const CELL_GAP = 50;
export const CELL_W = CELL_CONTENT_W + CELL_GAP;
export const CELL_H = CELL_CONTENT_H + CELL_GAP;
export const MIN_COORD = -25;
export const MAX_COORD = 25;

export function cellImageUrl(col: number, row: number): string {
  const seed = ((col - MIN_COORD) * 51 + (row - MIN_COORD)) % 1000;
  return `https://picsum.photos/seed/${seed}/320/200`;
}

type FeedCellProps = {
  col: number;
  row: number;
  onPress: (imageUri: string) => void;
};

export const FeedCell = memo(function FeedCell({
  col,
  row,
  onPress,
}: FeedCellProps) {
  const imageUri = cellImageUrl(col, row);

  return (
    <Animated.View
      entering={FadeInDown.duration(300).delay(200)}
      className="absolute overflow-hidden rounded-xl bg-[#1a1a1a]"
      style={{
        left: col * CELL_W + CELL_GAP / 2,
        top: row * CELL_H + CELL_GAP / 2 - (col % 2 !== 0 ? 60 : 0),
        width: CELL_CONTENT_W,
        height: CELL_CONTENT_H,
      }}
    >
      <Pressable style={{ flex: 1 }} onPress={() => onPress(imageUri)}>
        <Image
          source={{ uri: imageUri }}
          className="absolute inset-0 h-full w-full"
          resizeMode="cover"
        />
      </Pressable>
      {/* 산 뱃지 */}
      <View
        className="absolute right-4 top-4 flex-row items-center gap-1 rounded-full bg-[rgba(26,27,31,0.6)] py-[5px] pl-[5px] pr-[10px]"
        pointerEvents="none"
      >
        <MountainChipIcon size={18} />
        <Text className="text-label-normal-inverse typo-caption-1-semi-bold">
          관악산
        </Text>
      </View>
    </Animated.View>
  );
});
