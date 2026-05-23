import { PlusIcon } from "@/components/icons/plus-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Gender = "female" | "male";

export function OnboardingScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const birthDateRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [birthDate, setBirthDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  function advance(to: number): void {
    setStep((prev) => Math.max(prev, to));
  }

  useEffect(() => {
    const delay = 350;
    if (step === 2) setTimeout(() => birthDateRef.current?.focus(), delay);
    else if (step === 3) setTimeout(() => heightRef.current?.focus(), delay);
    else if (step === 4) setTimeout(() => weightRef.current?.focus(), delay);
    else if (step === 5)
      setTimeout(
        () => scrollRef.current?.scrollToEnd({ animated: true }),
        delay,
      );
  }, [step]);

  function handleNicknameEnd(): void {
    if (nickname.trim()) advance(1);
  }

  function handleGenderSelect(value: Gender): void {
    setGender(value);
    advance(2);
  }

  function handleBirthDateEnd(): void {
    if (birthDate.trim()) advance(3);
  }

  function handleHeightEnd(): void {
    if (height.trim()) advance(4);
  }

  function handleWeightEnd(): void {
    if (weight.trim()) advance(5);
  }

  return (
    <>
      <StatusBar style="dark" />
      <View
        className="flex-1 bg-fill-normal"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* 스텝 진행 바 */}
        <View className="h-1 w-full bg-fill-neutral">
          <View className="h-1 w-1/4 bg-secondary-normal" />
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerClassName="px-5 pt-7 pb-6"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text className="text-label-normal typo-heading-1-semi-bold">
            프로필 정보를 입력해 주세요
          </Text>

          <View className="mt-6 gap-6">
            {/* 아바타 */}
            <View className="items-center py-5">
              <View className="relative">
                <View className="size-[100px] items-center justify-center rounded-full bg-fill-stronger">
                  <UserIcon size={70} />
                </View>
                <Pressable className="absolute -right-2 bottom-0 size-8 items-center justify-center rounded-full bg-primary-normal">
                  <PlusIcon size={16} />
                </Pressable>
              </View>
            </View>

            {/* 체중 */}
            {step >= 4 && (
              <View className="gap-2">
                <Text className="text-label-subtle typo-body-2-normal-semi-bold">
                  체중
                </Text>
                <View className="h-12 flex-row items-center rounded-[10px] border border-line-subtle bg-fill-normal px-3">
                  <TextInput
                    ref={weightRef}
                    className="flex-1 text-label-normal typo-body-1-reading-regular"
                    placeholder="60"
                    placeholderTextColor="#73798c"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onEndEditing={handleWeightEnd}
                  />
                  <Text className="text-label-subtler typo-body-1-reading-regular">
                    kg
                  </Text>
                </View>
              </View>
            )}

            {/* 키 */}
            {step >= 3 && (
              <View className="gap-2">
                <Text className="text-label-subtle typo-body-2-normal-semi-bold">
                  키
                </Text>
                <View className="h-12 flex-row items-center rounded-[10px] border border-line-subtle bg-fill-normal px-3">
                  <TextInput
                    ref={heightRef}
                    className="flex-1 text-label-normal typo-body-1-reading-regular"
                    placeholder="170"
                    placeholderTextColor="#73798c"
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="number-pad"
                    returnKeyType="done"
                    onEndEditing={handleHeightEnd}
                  />
                  <Text className="text-label-subtler typo-body-1-reading-regular">
                    cm
                  </Text>
                </View>
              </View>
            )}

            {/* 생년월일 */}
            {step >= 2 && (
              <View className="gap-2">
                <Text className="text-label-subtle typo-body-2-normal-semi-bold">
                  생년월일
                </Text>
                <View className="h-12 flex-row items-center rounded-[10px] border border-line-subtle bg-fill-normal px-3">
                  <TextInput
                    ref={birthDateRef}
                    className="flex-1 text-label-normal typo-body-1-reading-regular"
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#73798c"
                    value={birthDate}
                    onChangeText={setBirthDate}
                    returnKeyType="done"
                    onEndEditing={handleBirthDateEnd}
                  />
                </View>
              </View>
            )}

            {/* 성별 */}
            {step >= 1 && (
              <View className="gap-[10px]">
                <Text className="text-label-subtle typo-body-2-normal-semi-bold">
                  성별
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    className={
                      gender === "female"
                        ? "h-14 flex-1 items-center justify-center rounded-[12px] border border-line-primary bg-interaction-subtle"
                        : "h-14 flex-1 items-center justify-center rounded-[12px] border border-line-subtle"
                    }
                    onPress={() => handleGenderSelect("female")}
                  >
                    <Text className="text-label-normal typo-body-1-normal-medium">
                      여성
                    </Text>
                  </Pressable>
                  <Pressable
                    className={
                      gender === "male"
                        ? "h-14 flex-1 items-center justify-center rounded-[12px] border border-line-primary bg-interaction-subtle"
                        : "h-14 flex-1 items-center justify-center rounded-[12px] border border-line-subtle"
                    }
                    onPress={() => handleGenderSelect("male")}
                  >
                    <Text className="text-label-normal typo-body-1-normal-medium">
                      남성
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}

            {/* 닉네임 */}
            <View className="gap-2">
              <Text className="text-label-subtle typo-body-2-normal-semi-bold">
                닉네임
              </Text>
              <View className="h-12 flex-row items-center rounded-[10px] border border-line-subtle bg-fill-normal px-3">
                <TextInput
                  className="flex-1 text-label-normal typo-body-1-reading-regular"
                  placeholder="닉네임을 입력해 주세요"
                  placeholderTextColor="#73798c"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={10}
                  returnKeyType="done"
                  onEndEditing={handleNicknameEnd}
                />
              </View>
              <Text className="text-label-subtler typo-caption-1-regular">
                10자 이내의 한글, 영문, 숫자만 가능해요
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        {step >= 5 && (
          <View className="px-5 pb-4 pt-3">
            <Pressable className="h-[52px] items-center justify-center rounded-[12px] bg-primary-normal">
              <Text className="text-label-normal-inverse typo-label-large">
                다음
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
}
