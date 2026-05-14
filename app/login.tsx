import { useAppleLogin } from "@/features/auth/hooks/use-apple-login";
import { useKakaoLogin } from "@/features/auth/hooks/use-kakao-login";
import * as AppleAuthentication from "expo-apple-authentication";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
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

      await appleLoginAsync({ identityToken, name, deviceType: "IOS" });
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
    try {
      await kakaoLoginAsync();
      router.replace("/(tabs)");
    } catch (e: unknown) {
      console.error("Kakao login error:", e);
    }
  }

  return (
    <View
      className="flex-1 bg-fill-normal"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 items-center justify-center px-5">
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 80, height: 80, borderRadius: 20 }}
          contentFit="contain"
        />
        <Text className="mt-4 text-label-normal typo-title-2-bold">세모산</Text>
        <Text className="mt-2 text-label-subtle typo-body-1-normal-regular">
          세상의 모든 산
        </Text>
      </View>

      <View className="gap-3 px-5" style={{ paddingBottom: 16 }}>
        <Pressable
          className="flex-row items-center justify-center h-14 rounded-xl"
          style={{ backgroundColor: "#FEE500" }}
          android_ripple={{ color: "rgba(0,0,0,0.1)" }}
          onPress={handleKakaoLogin}
        >
          <Text className="typo-body-1-normal-semi-bold" style={{ color: "#191919" }}>
            카카오로 계속하기
          </Text>
        </Pressable>

        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={12}
          style={{ height: 56 }}
          onPress={handleAppleLogin}
        />
      </View>
    </View>
  );
}
