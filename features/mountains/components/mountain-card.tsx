import React from "react";
import { Text, View } from "react-native";

export type Difficulty = "하" | "중" | "상";

export type Mountain = {
  id: number;
  name: string;
  location: string;
  altitude: number;
  difficulty: Difficulty;
};

export const MOCK_MOUNTAINS: Mountain[] = [
  { id: 1, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "중" },
  { id: 2, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "상" },
  { id: 3, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "하" },
  { id: 4, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "중" },
  { id: 5, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "상" },
  { id: 6, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "하" },
  { id: 7, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "중" },
  { id: 8, name: "관악산", location: "경기 과천시 중앙동", altitude: 632, difficulty: "상" },
];

export const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  하: "text-green-500",
  중: "text-blue-500",
  상: "text-red-500",
};

export function MountainCard({ mountain }: { mountain: Mountain }): React.JSX.Element {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-[72px] w-[86px] rounded-[10px] bg-fill-stronger" />
      <View className="flex-col gap-1.5">
        <View className="flex-row items-end gap-[9px]">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            {mountain.name}
          </Text>
          <Text className="pb-[3px] text-label-subtler typo-body-3-medium">
            {mountain.location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Text className="text-label-subtle typo-body-3-medium">
            고도 {mountain.altitude}m
          </Text>
          <View className="h-0.5 w-0.5 rounded-full bg-label-subtler" />
          <Text className={`typo-body-3-semi-bold ${DIFFICULTY_STYLE[mountain.difficulty]}`}>
            난이도 {mountain.difficulty}
          </Text>
        </View>
      </View>
    </View>
  );
}
