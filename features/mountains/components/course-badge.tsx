import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import { type CourseDifficulty } from "@/features/mountains/constants/mountain-detail";
import React from "react";
import { Text, View } from "react-native";

export function CourseBadge({
  difficulty,
}: {
  difficulty: CourseDifficulty;
}): React.JSX.Element {
  const { bg, text } = COURSE_BADGE[difficulty];
  return (
    <View className={`items-center justify-center rounded-[4px] px-1 ${bg}`}>
      <Text className={`typo-body-2-normal-medium ${text}`}>{difficulty}</Text>
    </View>
  );
}
