import { PlusIcon } from "@/components/icons/plus-icon";
import { useFreePosts } from "@/features/community/hooks/use-free-posts";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { PostItem } from "./post-item";

export function FreeBoardScreen() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFreePosts();

  const posts = data?.pages.flatMap((page) => page.content ?? []) ?? [];

  return (
    <View className="flex-1">
      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostItem post={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator className="py-4" />
          ) : null
        }
      />
      <Pressable
        onPress={() => router.push("/community/free-board/write")}
        className="absolute bottom-6 right-5 size-14 items-center justify-center rounded-full bg-primary-normal"
      >
        <PlusIcon />
      </Pressable>
    </View>
  );
}
