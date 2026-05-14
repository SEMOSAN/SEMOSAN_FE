import { WriteScreen } from "@/features/community/write/components/write-screen";
import { Stack } from "expo-router";

export default function FreeBoardWritePage() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <WriteScreen />
    </>
  );
}
