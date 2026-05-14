import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import { Text, View } from "react-native";

export function CourseBadge({
  difficulty,
}: {
  difficulty?: "EASY" | "NORMAL" | "HARD";
}) {
  if (!difficulty) return null;

  const { bg, text } = COURSE_BADGE[difficulty].style;
  return (
    <View className={`items-center justify-center rounded-[4px] px-1 ${bg}`}>
      <Text className={`typo-body-2-normal-medium ${text}`}>{COURSE_BADGE[difficulty].korean}</Text>
    </View>
  );
}
