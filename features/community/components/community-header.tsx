import { SearchIcon } from "@/components/icons/search-icon";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function CommunityHeader(): React.JSX.Element {
  const router = useRouter();
  return (
    <View className="h-14 flex-row items-center justify-between bg-fill-normal px-5">
      <Text className="flex-1 typo-headline-1-semi-bold text-label-normal">
        커뮤니티
      </Text>
      <Pressable
        onPress={() => router.push("/community/free-board/search")}
        hitSlop={8}
      >
        <SearchIcon />
      </Pressable>
    </View>
  );
}
