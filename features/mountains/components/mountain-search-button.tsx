import { SearchIcon } from "@/components/icons/search-icon";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

export function MountainSearchButton(): React.JSX.Element {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push("/mountains/search")} hitSlop={8}>
      <SearchIcon />
    </Pressable>
  );
}
