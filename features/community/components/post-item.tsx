import { ChatIcon } from "@/components/icons/chat-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { Post } from "@/features/community/constants/mock-posts";
import React from "react";
import { Text, View } from "react-native";
import { StatItem } from "./stat-item";
import { Thumbnail } from "./thumbnail";

export function PostItem({ post }: { post: Post }) {
  const hasImage = !!post.imageCount && post.imageCount > 0;
  return (
    <View className="border-b border-line-subtle px-5 py-4">
      <View className="gap-3">
        <View className={`flex-row ${hasImage ? "gap-3" : ""}`}>
          <View className="flex-1 gap-1">
            <Text
              className="typo-body-1-normal-semi-bold text-label-normal"
              numberOfLines={1}
            >
              {post.title}
            </Text>
            <Text
              className="typo-body-2-reading-regular text-label-subtle"
              numberOfLines={2}
            >
              {post.body}
            </Text>
          </View>
          {hasImage && <Thumbnail imageCount={post.imageCount!} />}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="typo-caption-1-regular text-label-subtler">
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
    </View>
  );
}
