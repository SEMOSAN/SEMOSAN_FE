import { SearchIcon } from "@/components/icons/search-icon";
import { Pressable } from "react-native";

export function MountainSearchButton() {
  const handleSearch = (): void => {
    // TODO : 산 검색기능 구현
  };

  return (
    <Pressable onPress={handleSearch} hitSlop={8}>
      <SearchIcon />
    </Pressable>
  );
}
