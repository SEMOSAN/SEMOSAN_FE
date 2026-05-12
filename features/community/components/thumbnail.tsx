import React from "react";
import { Text, View } from "react-native";

export function Thumbnail({ imageCount }: { imageCount: number }) {
  const extraCount = imageCount - 1;
  return (
    <View className="size-[68px] rounded-[4px] bg-neutral-100 overflow-hidden">
      {extraCount > 0 && (
        <View className="absolute bottom-0 right-0 bg-black/70 rounded px-1 justify-center items-center">
          <Text className="typo-caption-1-regular text-common-100">
            +{extraCount}
          </Text>
        </View>
      )}
    </View>
  );
}
