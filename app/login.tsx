import * as Sentry from "@sentry/react-native";
import { AppleIcon } from "@/components/icons/apple-icon";
import { KakaoIcon } from "@/components/icons/kakao-icon";
import { SemosanIcon } from "@/components/icons/semosan-icon";
import { SemosanTextLogo } from "@/components/icons/semosan-text-logo";
import { isDevMode, isExpoGo } from "@/constants/platform";
import { TermsAgreementSheet } from "@/features/auth/components/terms-agreement-sheet";
import { useAppleLogin } from "@/features/auth/hooks/use-apple-login";
import { useKakaoLogin } from "@/features/auth/hooks/use-kakao-login";
import { useTestLogin } from "@/features/auth/hooks/use-test-login";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type PendingProvider = "kakao" | "apple" | null;

export default function LoginScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mutateAsync: appleLoginAsync } = useAppleLogin();
  const { mutateAsync: kakaoLoginAsync } = useKakaoLogin();
  const { mutateAsync: testLoginAsync } = useTestLogin();

  const [termsVisible, setTermsVisible] = useState(false);
  const pendingProvider = useRef<PendingProvider>(null);

  // 소셜 로그인 버튼 → 약관 시트 표시
  function openTermsSheet(provider: "kakao" | "apple") {
    pendingProvider.current = provider;
    setTermsVisible(true);
  }

  // 약관 동의 확인 → 실제 로그인 실행
  async function handleTermsConfirm(_agreedMarketing: boolean) {
    setTermsVisible(false);
    const provider = pendingProvider.current;
    pendingProvider.current = null;

    if (provider === "apple") {
      await doAppleLogin();
    } else if (provider === "kakao") {
      await doKakaoLogin();
    }
  }

  async function doAppleLogin(): Promise<void> {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { identityToken, fullName } = credential;
      if (!identityToken) return;

      const name = [fullName?.familyName, fullName?.givenName]
        .filter(Boolean)
        .join("");

      const result = await appleLoginAsync({
        identityToken,
        name,
        deviceType: Platform.OS.toUpperCase() as "IOS" | "ANDROID",
      });
      router.replace(result.onboardingCompleted ? "/(tabs)" : "/onboarding");
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        "code" in e &&
        (e as { code: string }).code === "ERR_REQUEST_CANCELED"
      ) {
        return;
      }
      console.error("Apple login error:", e);
      Sentry.captureException(new Error("AppleLoginFailed"));
    }
  }

  async function doKakaoLogin(): Promise<void> {
    if (isExpoGo) {
      Alert.alert(
        "카카오 로그인 불가",
        "카카오 로그인은 Expo Go에서 사용할 수 없습니다.",
      );
      return;
    }
    try {
      const result = await kakaoLoginAsync();
      router.replace(result.onboardingCompleted ? "/(tabs)" : "/onboarding");
    } catch (e: unknown) {
      console.error("Kakao login error:", e);
      Sentry.captureException(new Error("KakaoLoginFailed"));
    }
  }

  function handleTestLogin(): void {
    if (Platform.OS === "web") {
      const value = window.prompt("testUserId를 입력하세요", "1");
      if (value === null) return;
      const parsed = parseInt(value, 10);
      const testUserId = !isNaN(parsed) ? parsed : 1;
      testLoginAsync({ testUserId })
        .then((result) => {
          router.replace(
            result.onboardingCompleted ? "/(tabs)" : "/onboarding",
          );
        })
        .catch((e: unknown) => {
          console.error("Test login error:", e);
        });
      return;
    }

    Alert.prompt(
      "테스트 로그인",
      "testUserId를 입력하세요",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그인",
          onPress: async (value: string | undefined) => {
            const parsed = parseInt(value ?? "", 10);
            const testUserId = !isNaN(parsed) ? parsed : 1;
            try {
              const result = await testLoginAsync({ testUserId });
              router.replace(
                result.onboardingCompleted ? "/(tabs)" : "/onboarding",
              );
            } catch (e: unknown) {
              console.error("Test login error:", e);
            }
          },
        },
      ],
      "plain-text",
      "1",
      "number-pad",
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <TermsAgreementSheet
        visible={termsVisible}
        onConfirm={handleTermsConfirm}
        onDismiss={() => {
          setTermsVisible(false);
          pendingProvider.current = null;
        }}
      />
      <View
        className="flex-1 bg-neutral-900"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <View className="flex-1 flex-row items-center justify-center gap-3">
          <SemosanIcon size={39} />
          <SemosanTextLogo width={162} />
        </View>

        <View className="gap-4 px-[43px]" style={{ paddingBottom: 120 }}>
          <Pressable
            className="h-[45px] flex-row items-center justify-center gap-3 overflow-hidden rounded-lg"
            style={{ backgroundColor: "#FEE500" }}
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={() => openTermsSheet("kakao")}
          >
            <KakaoIcon size={18} />
            <Text
              className="typo-body-1-normal-semi-bold"
              style={{ color: "rgba(0,0,0,0.85)" }}
            >
              카카오로 시작하기
            </Text>
          </Pressable>

          <Pressable
            className="h-[45px] flex-row items-center justify-center gap-3 overflow-hidden rounded-lg bg-white"
            android_ripple={{ color: "rgba(0,0,0,0.1)" }}
            onPress={() => openTermsSheet("apple")}
          >
            <AppleIcon size={20} />
            <Text
              className="typo-body-1-normal-semi-bold"
              style={{ color: "#000000" }}
            >
              Apple로 시작하기
            </Text>
          </Pressable>
        </View>

        {isDevMode && (
          <Pressable
            className="absolute right-5 rounded-full bg-neutral-700 px-4 py-2"
            style={{ bottom: insets.bottom + 128 }}
            onPress={handleTestLogin}
          >
            <Text className="text-label-normal-inverse typo-caption-1-semi-bold">
              테스트 로그인
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
}
