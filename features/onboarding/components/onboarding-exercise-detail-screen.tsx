import { LongButton } from "@/components/long-button";
import { OptionButton } from "@/components/option-button";
import {
  DURATION_OPTIONS,
  EXERCISE_LABELS,
  ExerciseDuration,
  ExerciseFrequency,
  FREQUENCY_OPTIONS,
} from "@/features/onboarding/constants/exercise";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { useSubmitOnboardingFromStore } from "@/features/onboarding/store/use-submit-onboarding-from-store";
import { ApiError } from "@/lib/api";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { authState } from "@/store/auth.store";
import { toast } from "@/store/toast.store";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OnboardingExerciseDetailScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();

  const exerciseType = useOnboardingStore((s) => s.exerciseType);
  const setExerciseDuration = useOnboardingStore((s) => s.setExerciseDuration);
  const setExerciseFrequency = useOnboardingStore(
    (s) => s.setExerciseFrequency,
  );
  const { submit, isPending } = useSubmitOnboardingFromStore();

  const [selectedDuration, setSelectedDuration] =
    useState<ExerciseDuration | null>(null);
  const [selectedFrequency, setSelectedFrequency] =
    useState<ExerciseFrequency | null>(null);

  async function handleStart(): Promise<void> {
    if (!selectedDuration || !selectedFrequency) return;
    setExerciseDuration(selectedDuration);
    setExerciseFrequency(selectedFrequency);
    try {
      await submit();
      router.replace("/(tabs)");
    } catch (e) {
      if (e instanceof ApiError && e.statusCode === 409) {
        const saved = await tokenStorage.setOnboardingPending(false);
        if (!saved) {
          toast.show("잠시후 다시 시도해주십시오.");
          return;
        }
        authState.setAuthenticated();
        toast.show("이미 등록된 사용자입니다.");
        router.replace("/(tabs)");
      } else {
        toast.show("잠시후 다시 시도해주십시오.");
      }
    }
  }

  const exerciseLabel = EXERCISE_LABELS[exerciseType];

  return (
    <View
      className="flex-1 bg-fill-normal"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* 진행 바 */}
      <View className="h-1 w-full bg-fill-neutral">
        <View className="h-1 w-full bg-secondary-normal" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-7 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* 헤더 */}
        <View className="flex-row items-center gap-1">
          <View className="rounded-[6px] bg-fill-stronger px-2 py-[2px]">
            <Text className="text-label-normal typo-headline-1-semi-bold">
              {exerciseLabel}
            </Text>
          </View>
          <Text className="text-label-normal typo-heading-1-semi-bold">
            루틴에 대해 궁금해요.
          </Text>
        </View>

        {/* 섹션 1: 운동 시간 — 빈도 선택 후 위에 노출 */}
        {selectedDuration !== null && (
          <View className="mt-8 gap-[10px]">
            <Text className="text-label-normal typo-headline-1-semi-bold">
              운동 시간은 어떻게 되시나요?
            </Text>
            {FREQUENCY_OPTIONS.map((option) => (
              <OptionButton
                key={option.value}
                label={option.label}
                selected={selectedFrequency === option.value}
                onPress={() => setSelectedFrequency(option.value)}
              />
            ))}
          </View>
        )}

        {/* 섹션 2: 운동 빈도 — 항상 노출, 운동 시간 섹션 생성 시 아래로 밀림 */}
        <View className="mt-8 gap-[10px]">
          <Text className="text-label-normal typo-headline-1-semi-bold">
            운동 빈도는 어떻게 되시나요?
          </Text>
          {DURATION_OPTIONS.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={selectedDuration === option.value}
              onPress={() => setSelectedDuration(option.value)}
            />
          ))}
        </View>
      </ScrollView>

      {/* 시작하기 버튼 — 두 섹션 모두 선택 시 노출 */}
      {selectedDuration !== null && selectedFrequency !== null && (
        <View className="px-5 pb-4 pt-3">
          <LongButton
            label="시작하기"
            onPress={handleStart}
            loading={isPending}
          />
        </View>
      )}
    </View>
  );
}
