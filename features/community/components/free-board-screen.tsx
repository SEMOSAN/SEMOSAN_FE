import { PlusIcon } from "@/components/icons/plus-icon";
import { useFreePosts } from "@/features/community/hooks/use-free-posts";
import { useRouter } from "expo-router";
import { LoadingSpinner } from "@/components/loading-spinner";
import { FlatList, Pressable, RefreshControl, View } from "react-native";
import { PostItem } from "./post-item";

export function FreeBoardScreen() {
  const router = useRouter();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
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
        windowSize={7}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="items-center py-4">
              <LoadingSpinner size={40} />
            </View>
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
