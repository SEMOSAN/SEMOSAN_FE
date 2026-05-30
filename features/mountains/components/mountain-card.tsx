import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import { MountainListResponse } from "@/types/api.generated";
import { Image, Text, View } from "react-native";

type MountainDifficulty = NonNullable<MountainListResponse["difficulty"]>;

export const DIFFICULTY_LABEL: Record<MountainDifficulty, string> = {
  EASY: "하",
  NORMAL: "중",
  HARD: "상",
};

export function MountainCard({ mountain }: { mountain: MountainListResponse }) {
  return (
    <View className="flex-row items-center gap-4">
      {mountain.imageUrls?.[0] ? (
        <Image
          source={{ uri: mountain.imageUrls[0] }}
          className="h-[72px] w-[86px] rounded-[10px] bg-fill-stronger"
          resizeMode="cover"
        />
      ) : (
        <View className="h-[72px] w-[86px] rounded-[10px] bg-fill-stronger" />
      )}
      <View className="flex-1 flex-col gap-1.5">
        <View className="flex-row items-end gap-[9px]">
          <Text className="shrink-0 text-label-normal typo-headline-1-semi-bold">
            {mountain.name}
          </Text>
          <Text
            className="shrink pb-[3px] text-label-subtler typo-body-3-medium"
            numberOfLines={1}
          >
            {mountain.address}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-label-subtle typo-body-3-medium">
            고도 {mountain.altitude}m
          </Text>
          <View className="h-0.5 w-0.5 rounded-full bg-label-subtler" />
          {mountain.difficulty && (
            <Text
              className={`typo-body-3-semi-bold ${COURSE_BADGE[mountain.difficulty].style.text}`}
            >
              난이도 {DIFFICULTY_LABEL[mountain.difficulty]}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
