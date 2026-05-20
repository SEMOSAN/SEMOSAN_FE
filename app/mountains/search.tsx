import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { MountainCard } from "@/features/mountains/components/mountain-card";
import { useMountainSearch } from "@/features/mountains/hooks/use-mountain-search";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MountainSearchScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<TextInput>(null);
  const { data, isPending } = useMountainSearch(keyword);
  const mountains = data?.content ?? [];
  const trimmed = keyword.trim();

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="h-14 flex-row items-center gap-3 bg-fill-normal px-5">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <CaretLeftIcon />
        </Pressable>
        <Pressable
          className="h-12 flex-1 flex-row items-center gap-2 rounded-full bg-fill-strong px-4"
          onPress={() => inputRef.current?.focus()}
        >
          <TextInput
            ref={inputRef}
            className="flex-1 text-label-normal typo-body-1-normal-regular"
            placeholder="산 이름, 지역으로 검색"
            placeholderTextColor="#73798C"
            value={keyword}
            onChangeText={setKeyword}
            autoFocus
            returnKeyType="search"
          />
          <SearchIcon />
        </Pressable>
      </View>

      {/* Result summary */}
      {trimmed.length > 0 && (
        <View className="flex-row items-center gap-1.5 px-5 py-3">
          <Text className="text-label-normal typo-body-2-normal-semi-bold">
            {`'${keyword}' 관련 검색 결과`}
          </Text>
          {!isPending && (
            <Text className="text-label-subtler typo-body-2-normal-regular">
              {mountains.length}개
            </Text>
          )}
        </View>
      )}

      {/* Results */}
      {trimmed.length > 0 && isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={mountains}
          keyExtractor={(item) => String(item.mountainId)}
          renderItem={({ item }) => (
            <Pressable
              className="px-5 py-3"
              onPress={() => router.push(`/mountains/${item.mountainId}`)}
            >
              <MountainCard mountain={item} />
            </Pressable>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}
