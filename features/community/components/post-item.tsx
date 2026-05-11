import { ChatIcon } from "@/components/icons/chat-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { Post } from "@/features/community/constants/mock-posts";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { StatItem } from "./stat-item";
import { Thumbnail } from "./thumbnail";

export function PostItem({ post }: { post: Post }) {
  const hasImage = !!post.imageCount && post.imageCount > 0;
  return (
    <Pressable
      onPress={() => {
        // TODO : 게시글 상세페이지 이동 구현
      }}
      className="border-b border-line-subtle px-5 py-4"
    >
      <View className="gap-3">
        <View className={`flex-row ${hasImage ? "gap-3" : ""}`}>
          <View className="flex-1 gap-1">
            <Text
              className="text-label-normal typo-body-1-normal-semi-bold"
              numberOfLines={1}
            >
              {post.title}
            </Text>
            <Text
              className="text-label-subtle typo-body-2-reading-regular"
              numberOfLines={2}
            >
              {post.body}
            </Text>
          </View>
          {hasImage && <Thumbnail imageCount={post.imageCount!} />}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-label-subtler typo-caption-1-regular">
            {post.date}
          </Text>
          <View className="flex-row gap-3">
            <StatItem icon={<EyeIcon />} count={post.views} />
            <StatItem
              icon={<HeartIcon size={14} color="#73798c" />}
              count={post.likes}
            />
            <StatItem icon={<ChatIcon />} count={post.comments} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
