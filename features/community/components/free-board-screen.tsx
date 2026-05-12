import { PlusIcon } from "@/components/icons/plus-icon";
import { MOCK_POSTS } from "@/features/community/constants/mock-posts";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { PostItem } from "./post-item";

export function FreeBoardScreen() {
  const router = useRouter();
  return (
    <View className="flex-1">
      <FlatList
        data={MOCK_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem post={item} />}
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
