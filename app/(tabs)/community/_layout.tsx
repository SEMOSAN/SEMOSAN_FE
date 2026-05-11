import { CommunityHeader } from "@/features/community/components/community-header";
import { Slot } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommunityLayout(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      <CommunityHeader />
      <Slot />
    </View>
  );
}
