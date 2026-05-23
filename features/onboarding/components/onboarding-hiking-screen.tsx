import { useSubmitOnboarding } from "@/features/onboarding/hooks/use-submit-onboarding";
import { useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HikingLevel = "EXPERT" | "EXPERIENCED" | "HOBBY" | "BEGINNER";

const OPTIONS: { label: string; value: HikingLevel }[] = [
  { label: "등산이 제 일상이에요 (숙련자)", value: "EXPERT" },
  { label: "취미로 즐기는 편이에요 (경험자)", value: "EXPERIENCED" },
  { label: "가끔 기분 전환으로 가요 (취미자)", value: "HOBBY" },
  { label: "이제 막 시작했어요 (입문자)", value: "BEGINNER" },
];

export function OnboardingHikingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { mutate: submitOnboarding, isPending } = useSubmitOnboarding();
  const params = useLocalSearchParams<{
    nickname: string;
    profileUrl: string;
    birthDate: string;
    gender: "MALE" | "FEMALE" | "NONE";
    height: string;
    weight: string;
  }>();

  function handleSelect(hikingLevel: HikingLevel): void {
    submitOnboarding({
      nickname: params.nickname || undefined,
      profileUrl: params.profileUrl || undefined,
      birthDate: params.birthDate,
      gender: params.gender,
      height: Number(params.height),
      weight: Number(params.weight),
      hikingLevel,
      exerciseType: "NONE",
      pushNotificationEnabled: true,
      liveActivityEnabled: true,
      voiceEnabled: true,
    });
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
          {OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              className="items-center justify-center rounded-[12px] border border-line-subtle p-4"
              onPress={() => handleSelect(option.value)}
              disabled={isPending}
            >
              <Text className="w-full text-label-normal typo-body-1-normal-medium">
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
