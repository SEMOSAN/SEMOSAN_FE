import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function WriteHeader() {
  const router = useRouter();
  return (
    <View className="h-14 flex-row items-center justify-between bg-fill-normal px-5">
      <Pressable onPress={() => router.back()} hitSlop={8} className="flex-1">
        <CaretLeftIcon />
      </Pressable>
      <Text className="flex-1 text-center text-label-normal typo-headline-1-semi-bold">
        게시글 작성하기
      </Text>
      <View className="flex-1" />
    </View>
  );
}
