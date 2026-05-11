import React from "react";
import { Text, View } from "react-native";

export function StatItem({
  icon,
  count,
}: {
  icon: React.ReactNode;
  count: number;
}) {
  return (
    <View className="flex-row items-center gap-1">
      {icon}
      <Text className="typo-caption-1-regular text-label-subtler">{count}</Text>
    </View>
  );
}
