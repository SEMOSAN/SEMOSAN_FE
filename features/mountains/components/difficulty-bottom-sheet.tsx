import { LongButton } from "@/components/long-button";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { FilterBottomSheet } from "./filter-bottom-sheet";

export type DifficultyOption = "high" | "medium" | "low";

const DIFFICULTY_OPTIONS: {
  value: DifficultyOption;
  label: string;
  selectedStyle: { chip: string; text: string };
}[] = [
  {
    value: "high",
    label: "난이도 상",
    selectedStyle: { chip: "bg-red-100 border-red-300", text: "text-red-600" },
  },
  {
    value: "medium",
    label: "난이도 중",
    selectedStyle: {
      chip: "bg-blue-100 border-blue-200",
      text: "text-blue-600",
    },
  },
  {
    value: "low",
    label: "난이도 하",
    selectedStyle: {
      chip: "bg-green-100 border-green-300",
      text: "text-green-600",
    },
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  selected: DifficultyOption[];
  onApply: (selected: DifficultyOption[]) => void;
};

export function DifficultyBottomSheet({
  visible,
  onClose,
  selected,
  onApply,
}: Props) {
  const [localSelected, setLocalSelected] = useState<DifficultyOption[]>(selected);

  useEffect(() => {
    if (visible) setLocalSelected(selected);
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (option: DifficultyOption): void => {
    setLocalSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleApply = (): void => {
    onApply(localSelected);
  };

  return (
    <FilterBottomSheet visible={visible} onClose={onClose} title="난이도">
      <View className="px-5 pt-3">
        <View className="flex-row justify-center gap-3">
          {DIFFICULTY_OPTIONS.map(({ value, label, selectedStyle }) => {
            const isSelected = localSelected.includes(value);
            return (
              <Pressable
                key={value}
                onPress={() => toggle(value)}
                className={`rounded-full border px-3 py-1.5 ${
                  isSelected
                    ? selectedStyle.chip
                    : "border-line-subtle bg-fill-normal"
                }`}
              >
                <Text
                  className={`typo-body-2-normal-medium ${
                    isSelected ? selectedStyle.text : "text-label-subtle"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View className="h-[45px]" />

      <View className="px-5 pb-4 pt-4">
        <LongButton label="적용하기" onPress={handleApply} />
      </View>
    </FilterBottomSheet>
  );
}
