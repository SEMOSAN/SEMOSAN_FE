import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export function PostDetailHeader() {
  const router = useRouter();
  return (
    <View className="h-14 flex-row items-center justify-between bg-fill-normal px-5">
      <Pressable onPress={() => router.back()} hitSlop={8} className="flex-1">
        <CaretLeftIcon />
      </Pressable>
      <Text className="flex-1 text-center typo-headline-1-semi-bold text-label-normal">
        게시글
      </Text>
      <View className="flex-1" />
    </View>
  );
}
