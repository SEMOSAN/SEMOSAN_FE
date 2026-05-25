import { PlusIcon } from "@/components/icons/plus-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { LongButton } from "@/components/long-button";
import { TextField } from "@/components/text-field";
import { uploadImage } from "@/features/mypage/hooks/use-upload-image";
import { useCheckNickname } from "@/features/onboarding/hooks/use-check-nickname";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding-store";
import { ApiError } from "@/lib/api";
import {
  formatBirthDate,
  isAtLeast14YearsOld,
  isValidBirthDate,
} from "@/utils/birth-date";
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

  const setProfile = useOnboardingStore((s) => s.setProfile);
  const { mutateAsync: checkNickname, isPending: isCheckingNickname } = useCheckNickname();

  const [step, setStep] = useState(0);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const [nickname, setNickname] = useState("");
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const [gender, setGender] = useState<Gender | null>(null);

  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState<string | null>(null);

  const [height, setHeight] = useState("");
  const [heightError, setHeightError] = useState<string | null>(null);

  const [weight, setWeight] = useState("");
  const [weightError, setWeightError] = useState<string | null>(null);

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
    try {
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
    } catch (e: unknown) {
      console.error("Profile image upload error:", e);
    }
  }

  function handleNicknameChange(text: string): void {
    setNickname(text);
    if (text.length > 0 && !/^[가-힣a-zA-Z0-9]+$/.test(text)) {
      setNicknameError("한글, 영문, 숫자만 입력 가능해요");
    } else {
      setNicknameError(null);
    }
  }

  async function handleNicknameEnd(): Promise<void> {
    if (isCheckingNickname) return;
    const trimmed = nickname.trim();
    if (!trimmed) return;
    if (!/^[가-힣a-zA-Z0-9]+$/.test(trimmed)) {
      setNicknameError("한글, 영문, 숫자만 입력 가능해요");
      return;
    }
    if (trimmed.length < 2) {
      setNicknameError("2자 이상 입력해 주세요");
      return;
    }
    try {
      await checkNickname(trimmed);
      if (nickname.trim() !== trimmed) return;
      setNicknameError(null);
      advance(1);
    } catch (e) {
      if (nickname.trim() !== trimmed) return;
      if (e instanceof ApiError && e.statusCode === 409) {
        setNicknameError("이미 사용 중인 닉네임이에요");
      } else {
        setNicknameError("닉네임 확인 중 오류가 발생했어요");
      }
    }
  }

  function handleGenderSelect(value: Gender): void {
    setGender(value);
    advance(2);
  }

  function handleBirthDateChange(text: string): void {
    const formatted = formatBirthDate(text);
    setBirthDate(formatted);
    if (birthDateError) setBirthDateError(null);
    const digits = text.replace(/\D/g, "");
    if (digits.length === 8) Keyboard.dismiss();
  }

  function handleBirthDateEnd(): void {
    if (!birthDate.trim()) return;
    if (!isValidBirthDate(birthDate)) {
      setBirthDateError("올바른 날짜를 입력해 주세요");
      return;
    }
    if (!isAtLeast14YearsOld(birthDate)) {
      setBirthDateError("만 14세 이상만 가입할 수 있어요");
      return;
    }
    setBirthDateError(null);
    advance(3);
  }

  function handleHeightChange(text: string): void {
    setHeight(text);
    if (heightError) setHeightError(null);
    if (text.length === 3) Keyboard.dismiss();
  }

  function handleHeightEnd(): void {
    if (!height.trim()) return;
    const val = Number(height);
    if (val < 50 || val > 250) {
      setHeightError("50cm ~ 250cm 사이로 입력해 주세요");
      return;
    }
    setHeightError(null);
    advance(4);
  }

  function handleWeightChange(text: string): void {
    setWeight(text);
    if (weightError) setWeightError(null);
    if (text.length >= 2) advance(5);
    if (text.length === 3) Keyboard.dismiss();
  }

  function handleWeightEnd(): void {
    if (!weight.trim()) {
      setWeightError("체중을 입력해 주세요");
      return;
    }
    const val = Number(weight);
    if (isNaN(val) || val < 20 || val > 300) {
      setWeightError("20kg ~ 300kg 사이로 입력해 주세요");
      return;
    }
    setWeightError(null);
    advance(5);
  }

  function handleSubmit(): void {
    setProfile({
      nickname: nickname.trim(),
      profileUrl: profileImageUrl ?? "",
      birthDate,
      gender:
        gender === "male" ? "MALE" : gender === "female" ? "FEMALE" : "NONE",
      height: Number(height),
      weight: Number(weight),
    });
    router.push("/onboarding/hiking");
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
                error={!!weightError}
                description={weightError ?? undefined}
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
                error={!!heightError}
                description={heightError ?? undefined}
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
                error={!!birthDateError}
                description={birthDateError ?? undefined}
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
              description={nicknameError ?? "2자 이상 10자 이내의 한글, 영문, 숫자만 가능해요"}
              error={!!nicknameError}
              maxLength={10}
              onEndEditing={handleNicknameEnd}
            />
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        {step >= 5 &&
          !nicknameError &&
          !birthDateError &&
          !heightError &&
          !weightError && (
          <View className="px-5 pb-4 pt-3">
            <LongButton label="다음" onPress={handleSubmit} />
          </View>
        )}
      </View>
    </>
  );
}
