import { PlusIcon } from "@/components/icons/plus-icon";
import { MOCK_POSTS } from "@/features/community/constants/mock-posts";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { PostItem } from "./post-item";

export function FreeBoardScreen() {
  return (
    <View className="flex-1">
      <ScrollView>
        {MOCK_POSTS.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </ScrollView>
      <Pressable className="absolute bottom-6 right-5 size-14 rounded-full bg-primary-normal items-center justify-center">
        <PlusIcon />
      </Pressable>
    </View>
  );
}
