import { useLogout } from "@/features/auth/hooks/use-logout";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function MyScreen(): React.JSX.Element {
  const router = useRouter();
  const { mutateAsync: logoutAsync } = useLogout();

  async function handleLogout(): Promise<void> {
    await logoutAsync();
    router.replace("/login");
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-fill-normal">
      <Text className="typo-body-1-normal-regular text-label-normal">MY</Text>
      <Pressable
        className="rounded-xl bg-status-negative-normal px-6 py-3"
        onPress={handleLogout}
      >
        <Text className="typo-body-1-normal-semi-bold text-label-normal-inverse">
          로그아웃
        </Text>
      </Pressable>
    </View>
  );
}
