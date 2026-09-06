import { LongButton } from "@/components/long-button";
import { OptionButton } from "@/components/option-button";
import {
  EXERCISE_OPTIONS,
  ExerciseType,
} from "@/features/onboarding/constants/exercise";
import { useCompleteOnboarding } from "@/features/onboarding/hooks/use-complete-onboarding";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OnboardingExerciseScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const setExerciseType = useOnboardingStore((s) => s.setExerciseType);
  const { complete, isPending } = useCompleteOnboarding();
  const [selected, setSelected] = useState<ExerciseType | null>(null);

  async function handleNext(): Promise<void> {
    if (!selected) return;
    setExerciseType(selected);

    // 운동 안 함 선택 시 루틴 질문 없이 바로 회원가입 완료
    if (selected === "NONE") {
      await complete();
      return;
    }

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
          {EXERCISE_OPTIONS.map((option) => (
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
          <LongButton
            label="다음"
            onPress={handleNext}
            loading={selected === "NONE" && isPending}
          />
        </View>
      )}
    </View>
  );
}
