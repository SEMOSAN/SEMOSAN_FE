import { COURSE_BADGE } from "@/features/mountains/constants/course-badge";
import { MountainListResponse } from "@/types/api.generated";
import React from "react";
import { Image, Text, View } from "react-native";

type MountainDifficulty = NonNullable<MountainListResponse["difficulty"]>;

export const DIFFICULTY_LABEL: Record<MountainDifficulty, string> = {
  EASY: "하",
  NORMAL: "중",
  HARD: "상",
};

export const DIFFICULTY_STYLE: Record<MountainDifficulty, string> = {
  EASY: COURSE_BADGE.초급.text,
  NORMAL: COURSE_BADGE.중급.text,
  HARD: COURSE_BADGE.상급.text,
};

export function MountainCard({
  mountain,
}: {
  mountain: MountainListResponse;
}): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-4">
      <Image
        source={{ uri: mountain.imageUrl }}
        className="h-[72px] w-[86px] rounded-[10px] bg-fill-stronger"
        resizeMode="cover"
      />
      <View className="flex-col gap-1.5">
        <View className="flex-row items-end gap-[9px]">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            {mountain.name}
          </Text>
          <Text className="pb-[3px] text-label-subtler typo-body-3-medium">
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
              className={`typo-body-3-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}
            >
              난이도 {DIFFICULTY_LABEL[mountain.difficulty]}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
