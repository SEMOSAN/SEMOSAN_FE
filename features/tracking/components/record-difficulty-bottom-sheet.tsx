import { ModalSheet } from "@/components/modal-sheet";
import { FaceHappyIcon } from "@/components/icons/face-happy-icon";
import { FaceNeutralIcon } from "@/components/icons/face-neutral-icon";
import { FaceSadIcon } from "@/components/icons/face-sad-icon";
import { MountainMarkerBadgeIcon } from "@/components/icons/mountain-marker-badge-icon";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const { colors } = require("@/tokens.cjs") as {
  colors: Record<string, Record<string, string>>;
};

type Comparison = "SIMILAR" | "EASIER" | "HARDER";

type Props = {
  visible: boolean;
  mountainName: string;
  courseName?: string;
  onDismiss: () => void;
  onSave: (comparison: Comparison | null) => void;
};

const OPTIONS: {
  key: Comparison;
  label: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}[] = [
  {
    key: "EASIER",
    label: "쉬워요",
    Icon: FaceHappyIcon,
    color: colors.secondary.strong,
    borderClass: "border-secondary-strong",
    bgClass: "bg-green-50",
    textClass: "text-secondary-strong",
  },
  {
    key: "SIMILAR",
    label: "비슷해요",
    Icon: FaceNeutralIcon,
    color: colors.yellow["600"],
    borderClass: "border-yellow-600",
    bgClass: "bg-yellow-50",
    textClass: "text-yellow-600",
  },
  {
    key: "HARDER",
    label: "어려워요",
    Icon: FaceSadIcon,
    color: colors.red["500"],
    borderClass: "border-red-500",
    bgClass: "bg-red-50",
    textClass: "text-red-500",
  },
];

const DEFAULT_ICON_COLOR = colors.label.subtle;

export function RecordDifficultyBottomSheet({
  visible,
  mountainName,
  courseName,
  onDismiss,
  onSave,
}: Props) {
  const [selected, setSelected] = useState<Comparison | null>(null);

  const handleSave = () => {
    onSave(selected);
    setSelected(null);
  };

  return (
    <ModalSheet visible={visible} onDismiss={onDismiss}>
      <View className="gap-6 px-5 pt-4">
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <MountainMarkerBadgeIcon size={20} />
            <Text className="text-label-normal typo-body-1-normal-semi-bold">
              {mountainName}
            </Text>
            {!!courseName && (
              <Text
                className="text-label-subtle typo-body-1-normal-regular"
                numberOfLines={1}
              >
                {courseName}
              </Text>
            )}
          </View>
          <Text className="text-label-normal typo-heading-1-semi-bold">
            안내 난이도랑 비교해 어땠나요?
          </Text>
        </View>

        <View className="flex-row justify-center gap-4 py-9">
          {OPTIONS.map(
            ({ key, label, Icon, color, borderClass, bgClass, textClass }) => {
              const isSelected = selected === key;
              return (
                <TouchableOpacity
                  key={key}
                  className={`size-[80px] items-center justify-center gap-1 rounded-[10px] p-3 ${
                    isSelected
                      ? `border-[1.5px] ${borderClass} ${bgClass}`
                      : "border border-line-normal"
                  }`}
                  activeOpacity={0.7}
                  onPress={() => setSelected(key)}
                >
                  <Icon
                    size={28}
                    color={isSelected ? color : DEFAULT_ICON_COLOR}
                  />
                  <Text
                    className={`typo-body-2-normal-semi-bold ${
                      isSelected ? textClass : "text-label-subtle"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </View>

      <View className="px-4 pb-6 pt-8">
        <TouchableOpacity
          className="h-12 items-center justify-center rounded-[10px] bg-primary-normal"
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text className="text-label-normal-inverse typo-label-large">
            기록 저장하기
          </Text>
        </TouchableOpacity>
      </View>
    </ModalSheet>
  );
}
