import { PlusIcon } from "@/components/icons/plus-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { TextField } from "@/components/text-field";
import { uploadImage } from "@/features/mypage/hooks/use-upload-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Gender = "female" | "male";

export function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const birthDateRef = useRef<TextInput>(null);
  const heightRef = useRef<TextInput>(null);
  const weightRef = useRef<TextInput>(null);

  const [step, setStep] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState(false);

  const [gender, setGender] = useState<Gender | null>(null);

  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState(false);

  const [height, setHeight] = useState("");
  const [heightError, setHeightError] = useState(false);

  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState(false);

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

  async function handleProfileImagePress(): Promise<void> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const filename = asset.uri.split("/").pop() ?? "profile.jpg";
    const url = await uploadImage(asset.uri, filename);
    setProfileImageUrl(url);
  }

  function handleNicknameChange(text: string): void {
    setNickname(text);
    setNicknameError(text.length > 0 && !/^[가-힣a-zA-Z0-9]+$/.test(text));
  }

  function handleNicknameEnd(): void {
    if (nickname.trim() && !nicknameError) advance(1);
  }

  function handleGenderSelect(value: Gender): void {
    setGender(value);
    advance(2);
  }

  function handleBirthDateChange(text: string): void {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    if (digits.length > 6) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6)}`;
    }
    setBirthDate(formatted);
    if (birthDateError) setBirthDateError(false);
    if (digits.length === 8) Keyboard.dismiss();
  }

  function handleBirthDateEnd(): void {
    if (!birthDate.trim()) return;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate.trim())) {
      setBirthDateError(true);
      return;
    }
    setBirthDateError(false);
    advance(3);
  }

  function handleHeightChange(text: string): void {
    setHeight(text);
    if (heightError) setHeightError(false);
    if (text.length === 3) Keyboard.dismiss();
  }

  function handleHeightEnd(): void {
    if (!height.trim()) return;
    if (Number(height) <= 0) {
      setHeightError(true);
      return;
    }
    setHeightError(false);
    advance(4);
  }

  function handleWeightChange(text: string): void {
    setWeight(text);
    if (weightError) setWeightError(false);
    if (text.length >= 2) advance(5);
    if (text.length === 3) Keyboard.dismiss();
  }

  function handleWeightEnd(): void {
    if (!weight.trim()) return;
    if (Number(weight) <= 0) {
      setWeightError(true);
      return;
    }
    setWeightError(false);
    advance(5);
  }

  function handleSubmit(): void {
    router.push({
      pathname: "/onboarding/hiking",
      params: {
        nickname: nickname.trim(),
        profileUrl: profileImageUrl ?? "",
        birthDate,
        gender:
          gender === "male" ? "MALE" : gender === "female" ? "FEMALE" : "NONE",
        height,
        weight,
      },
    });
  }

  return (
    <>
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
              <Pressable className="relative" onPress={handleProfileImagePress}>
                <View className="size-[100px] items-center justify-center overflow-hidden rounded-full bg-fill-stronger">
                  {profileImageUrl ? (
                    <Image
                      source={{ uri: profileImageUrl }}
                      className="size-[100px]"
                    />
                  ) : (
                    <UserIcon size={70} />
                  )}
                </View>
                <View className="absolute -right-2 bottom-0 size-8 items-center justify-center rounded-full bg-primary-normal">
                  <PlusIcon size={16} />
                </View>
              </Pressable>
            </View>

            {/* 체중 */}
            {step >= 4 && (
              <TextField
                ref={weightRef}
                label="체중"
                value={weight}
                onChangeText={handleWeightChange}
                placeholder="60"
                suffix="kg"
                error={weightError}
                keyboardType="number-pad"
                onEndEditing={handleWeightEnd}
              />
            )}

            {/* 키 */}
            {step >= 3 && (
              <TextField
                ref={heightRef}
                label="키"
                value={height}
                onChangeText={handleHeightChange}
                placeholder="170"
                suffix="cm"
                error={heightError}
                keyboardType="number-pad"
                onEndEditing={handleHeightEnd}
              />
            )}

            {/* 생년월일 */}
            {step >= 2 && (
              <TextField
                ref={birthDateRef}
                label="생년월일"
                value={birthDate}
                onChangeText={handleBirthDateChange}
                placeholder="YYYY-MM-DD"
                error={birthDateError}
                keyboardType="number-pad"
                onEndEditing={handleBirthDateEnd}
              />
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
            <TextField
              label="닉네임"
              value={nickname}
              onChangeText={handleNicknameChange}
              placeholder="닉네임을 입력해 주세요"
              description="10자 이내의 한글, 영문, 숫자만 가능해요"
              error={nicknameError}
              maxLength={10}
              onEndEditing={handleNicknameEnd}
            />
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        {step >= 5 && (
          <View className="px-5 pb-4 pt-3">
            {/* TODO : 다음 누르면 로띠 돌아가는거 하나하자 */}
            <Pressable
              className="h-[52px] items-center justify-center rounded-[12px] bg-primary-normal"
              onPress={handleSubmit}
            >
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
