import { OptionButton } from "@/components/option-button";
import {
  HIKING_OPTIONS,
  HikingLevel,
} from "@/features/onboarding/constants/hiking";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OnboardingHikingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const setHikingLevel = useOnboardingStore((s) => s.setHikingLevel);
  const [selected, setSelected] = useState<HikingLevel | null>(null);

  function handleNext(): void {
    if (!selected) return;
    setHikingLevel(selected);
    router.push("/onboarding/exercise" as never);
  }

  return (
    <View
      className="flex-1 bg-fill-normal"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* 진행 바 */}
      <View className="h-1 w-full bg-fill-neutral">
        <View className="h-1 w-2/4 bg-secondary-normal" />
      </View>

      <View className="flex-1 px-5 pt-7">
        <Text className="text-label-normal typo-heading-1-semi-bold">
          등산을 얼마나 자주 하시나요?
        </Text>

        <View className="mt-6 gap-[10px]">
          {HIKING_OPTIONS.map((option) => (
            <OptionButton
              key={option.value}
              label={option.label}
              selected={selected === option.value}
              onPress={() => setSelected(option.value)}
            />
          ))}
        </View>
      </View>

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
