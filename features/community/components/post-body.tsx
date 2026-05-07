import { ChatIcon } from "@/components/icons/chat-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import React from "react";
import { Text, View } from "react-native";
import { PostAvatar } from "./post-avatar";

type PostBodyProps = {
  author: string;
  date: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
};

export function PostBody({
  author,
  date,
  title,
  body,
  likes,
  comments,
}: PostBodyProps) {
  return (
    <View className="gap-3 px-5 py-4">
      <View className="flex-row items-center gap-2">
        <PostAvatar size="lg" />
        <View>
          <Text className="typo-body-2-normal-semi-bold text-label-normal">
            {author}
          </Text>
          <Text className="typo-caption-1-regular text-label-subtler">
            {date}
          </Text>
        </View>
      </View>
      <View className="gap-2">
        <Text className="typo-body-1-normal-semi-bold text-label-normal">
          {title}
        </Text>
        <Text className="typo-body-2-reading-regular text-label-subtle">
          {body}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <View className="flex-row items-center gap-1">
          <HeartIcon size={20} color="#464a57" />
          <Text className="typo-body-1-normal-medium text-label-subtle">
            {likes}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ChatIcon size={20} color="#464a57" />
          <Text className="typo-body-1-normal-medium text-label-subtle">
            {comments}
          </Text>
        </View>
      </View>
    </View>
  );
}
