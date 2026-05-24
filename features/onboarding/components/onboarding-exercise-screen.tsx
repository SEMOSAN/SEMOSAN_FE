import { OptionButton } from "@/components/option-button";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { RegisterOnboardingRequest } from "@/types/api.generated";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ExerciseType = RegisterOnboardingRequest["exerciseType"];

const OPTIONS: { label: string; value: ExerciseType }[] = [
  { label: "헬스", value: "GYM" },
  { label: "등산", value: "HIKING" },
  { label: "러닝", value: "RUNNING" },
  { label: "수영", value: "SWIMMING" },
  { label: "홈트레이닝", value: "HOME_TRAINING" },
  { label: "필라테스/요가", value: "PILATES_YOGA" },
  { label: "스포츠 (배드민턴, 테니스, 축구 등)", value: "SPORTS" },
  { label: "크로스핏", value: "CROSSFIT" },
  { label: "운동 안 함", value: "NONE" },
];

export function OnboardingExerciseScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const setExerciseType = useOnboardingStore((s) => s.setExerciseType);
  const [selected, setSelected] = useState<ExerciseType | null>(null);

  function handleNext(): void {
    if (!selected) return;
    setExerciseType(selected);
    router.push("/onboarding/exercise-detail");
  }

  return (
    <View
      className="flex-1 bg-fill-normal"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* 진행 바 */}
      <View className="h-1 w-full bg-fill-neutral">
        <View className="h-1 w-3/4 bg-secondary-normal" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-7 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-label-normal typo-heading-1-semi-bold">
          가장 즐겨하는 운동은 무엇인가요?
        </Text>

        <View className="mt-6 gap-[10px]">
          {OPTIONS.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={selected === option.value}
              onPress={() => setSelected(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      {selected !== null && (
        <View className="px-5 pb-4 pt-3">
          <Pressable
            className="h-[52px] items-center justify-center rounded-[12px] bg-primary-normal"
            onPress={handleNext}
          >
            <Text className="text-label-normal-inverse typo-label-large">
              다음
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
