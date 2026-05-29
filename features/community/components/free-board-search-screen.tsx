import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { useSearchFreePosts } from "@/features/community/hooks/use-search-free-posts";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PostItem } from "./post-item";

export function FreeBoardSearchScreen(): React.JSX.Element {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");

  const { data, isLoading } = useSearchFreePosts(submittedKeyword);

  const posts = data?.content ?? [];
  const showEmpty =
    submittedKeyword.trim().length > 0 && !isLoading && posts.length === 0;

  const renderEmpty = useCallback(
    () =>
      showEmpty ? (
        <View className="flex-1 items-center justify-center pt-32">
          <Text
            className="text-center typo-body-1-normal-medium"
            style={{ color: "#73798c" }}
          >
            {"검색 결과가 없어요.\n다른 키워드로 검색해보세요!"}
          </Text>
        </View>
      ) : null,
    [showEmpty],
  );

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      <View className="h-14 flex-row items-center gap-3 px-5">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <CaretLeftIcon />
        </Pressable>
        <View
          className="flex-1 flex-row items-center rounded-full px-4"
          style={{ backgroundColor: "#f9fafb", height: 48 }}
        >
          <TextInput
            className="flex-1 typo-body-1-normal-regular text-label-normal"
            placeholder="검색어를 입력해주세요"
            placeholderTextColor="#b0b5c1"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => setSubmittedKeyword(keyword)}
            returnKeyType="search"
            autoFocus
          />
          {isLoading && submittedKeyword.trim().length > 0 ? (
            <LoadingSpinner size={24} />
          ) : (
            <SearchIcon />
          )}
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostItem post={item} />}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}
