import React from "react";
import { Pressable, Text, View } from "react-native";
import type { Comment } from "../constants/mock-post-detail";
import { PostAvatar } from "./post-avatar";

function ReplyItem({
  author,
  date,
  body,
  isAuthor,
}: {
  author: string;
  date: string;
  body: string;
  isAuthor?: boolean;
}) {
  return (
    <View className="flex-row gap-2 pl-[38px] py-3">
      <PostAvatar size="sm" />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-1 flex-wrap">
          <Text className="typo-caption-1-semi-bold text-label-normal">
            {author}
          </Text>
          <Text className="typo-caption-1-regular text-label-subtler">
            {date}
          </Text>
          {isAuthor && (
            <>
              <View className="size-[2px] rounded-full bg-label-subtler" />
              <Text className="typo-caption-1-regular text-label-subtler">
                작성자
              </Text>
            </>
          )}
        </View>
        <Text className="typo-body-2-reading-regular text-label-normal">
          {body}
        </Text>
        <Pressable hitSlop={8}>
          <Text className="typo-label-small text-neutral-500">답글 달기</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CommentItem({ comment }: { comment: Comment }) {
  return (
    <View>
      <View className="flex-row gap-2 py-3">
        <PostAvatar size="md" />
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-1 flex-wrap">
            <Text className="typo-caption-1-semi-bold text-label-normal">
              {comment.author}
            </Text>
            <Text className="typo-caption-1-regular text-label-subtler">
              {comment.date}
            </Text>
            {comment.isAuthor && (
              <>
                <View className="size-[2px] rounded-full bg-label-subtler" />
                <Text className="typo-caption-1-regular text-label-subtler">
                  작성자
                </Text>
              </>
            )}
          </View>
          <Text className="typo-body-2-reading-regular text-label-normal">
            {comment.body}
          </Text>
          <Pressable hitSlop={8}>
            <Text className="typo-label-small text-neutral-500">답글 달기</Text>
          </Pressable>
        </View>
      </View>
      {comment.replies?.map((reply) => (
        <ReplyItem key={reply.id} {...reply} />
      ))}
    </View>
  );
}
