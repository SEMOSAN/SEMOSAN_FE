import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { CloseSmallIcon } from "@/components/icons/close-small-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { MountainCard } from "@/features/mountains/components/mountain-card";
import { useMountainSearch } from "@/features/mountains/hooks/use-mountain-search";
import { useRecentSearches } from "@/features/mountains/hooks/use-recent-searches";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
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
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 500);
    return () => clearTimeout(timer);
  }, [keyword]);

  const { data, isPending } = useMountainSearch(debouncedKeyword);
  const { recentSearches, saveSearch, removeSearch } = useRecentSearches();
  const mountains = data?.content ?? [];
  const trimmed = keyword.trim();
  const hasKeyword = trimmed.length > 0;

  function handleSubmit(): void {
    saveSearch(keyword);
  }

  function handleRecentPress(term: string): void {
    setKeyword(term);
    inputRef.current?.focus();
  }

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
            placeholder="산이름, 지역명 검색"
            placeholderTextColor="#8B92A6"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSubmit}
            autoFocus
            returnKeyType="search"
          />
          <SearchIcon />
        </Pressable>
      </View>

      {hasKeyword ? (
        <>
          {/* Result summary */}
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

          {/* Results */}
          {isPending ? (
            <LoadingSpinner fullScreen />
          ) : (
            <FlatList
              data={mountains}
              keyExtractor={(item, index) =>
                item.mountainId?.toString() ?? index.toString()
              }
              renderItem={({ item }) => (
                <Pressable
                  className="px-5 py-3"
                  onPress={() => {
                    saveSearch(keyword);
                    router.push(`/mountains/${item.mountainId}`);
                  }}
                >
                  <MountainCard mountain={item} />
                </Pressable>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </>
      ) : (
        /* Recent searches */
        recentSearches.length > 0 && (
          <View className="px-5 pt-4">
            <Text className="text-label-normal typo-body-2-normal-semi-bold">
              최근 검색어
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {recentSearches.map((term) => (
                <View
                  key={term}
                  className="flex-row items-center gap-1 rounded-full bg-fill-stronger px-3 py-1.5"
                >
                  <Pressable onPress={() => handleRecentPress(term)}>
                    <Text className="text-label-normal typo-body-3-semi-bold">
                      {term}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => removeSearch(term)} hitSlop={4}>
                    <CloseSmallIcon size={14} color="#73798C" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )
      )}
    </View>
  );
}
