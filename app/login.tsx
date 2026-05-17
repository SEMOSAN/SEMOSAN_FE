import { useAppleLogin } from "@/features/auth/hooks/use-apple-login";
import { useKakaoLogin } from "@/features/auth/hooks/use-kakao-login";
import * as AppleAuthentication from "expo-apple-authentication";
import Constants from "expo-constants";
import { AppleIcon } from "@/components/icons/apple-icon";
import { KakaoIcon } from "@/components/icons/kakao-icon";
import { SemosanIcon } from "@/components/icons/semosan-icon";
import { SemosanTextLogo } from "@/components/icons/semosan-text-logo";
import { useRouter } from "expo-router";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LoginScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { mutateAsync: appleLoginAsync } = useAppleLogin();
  const { mutateAsync: kakaoLoginAsync } = useKakaoLogin();

  async function handleAppleLogin(): Promise<void> {
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

      await appleLoginAsync({
        identityToken,
        name,
        deviceType: Platform.OS.toUpperCase() as "IOS" | "ANDROID",
      });
      router.replace("/(tabs)");
    } catch (e: unknown) {
      if (
        e instanceof Error &&
        "code" in e &&
        (e as { code: string }).code === "ERR_REQUEST_CANCELED"
      ) {
        return;
      }
      console.error("Apple login error:", e);
    }
  }

  async function handleKakaoLogin(): Promise<void> {
    if (Constants.executionEnvironment === "storeClient") {
      Alert.alert(
        "카카오 로그인 불가",
        "카카오 로그인은 Expo Go에서 사용할 수 없습니다.",
      );
      return;
    }
    try {
      await kakaoLoginAsync();
      router.replace("/(tabs)");
    } catch (e: unknown) {
      console.error("Kakao login error:", e);
    }
  }

  return (
    <View
      className="flex-1 bg-neutral-900"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 flex-row items-center justify-center gap-3">
        <SemosanIcon size={39} />
        <SemosanTextLogo width={162} />
      </View>

      <View className="gap-4 px-[43px]" style={{ paddingBottom: 16 }}>
        <Pressable
          className="h-[45px] flex-row items-center justify-center gap-3 rounded-lg overflow-hidden"
          style={{ backgroundColor: "#FEE500" }}
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          onPress={handleKakaoLogin}
        >
          <KakaoIcon size={18} />
          <Text className="typo-body-1-normal-semi-bold" style={{ color: "rgba(0,0,0,0.85)" }}>
            카카오로 시작하기
          </Text>
        </Pressable>

<Pressable
          className="h-[45px] flex-row items-center justify-center gap-3 rounded-lg bg-white overflow-hidden"
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          onPress={handleAppleLogin}
        >
          <AppleIcon size={20} />
          <Text className="typo-body-1-normal-semi-bold" style={{ color: "#000000" }}>
            Apple로 시작하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
