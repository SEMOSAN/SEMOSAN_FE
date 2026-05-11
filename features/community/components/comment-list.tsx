import React from "react";
import { Text, View } from "react-native";
import type { Comment } from "../constants/mock-post-detail";
import { CommentItem } from "./comment-item";

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return (
      <View className="flex-1 items-center justify-center pb-5">
        <Text className="typo-body-1-normal-medium text-label-subtler text-center">
          {"아직 댓글이 없어요.\n가장 먼저 댓글을 남겨보세요!"}
        </Text>
      </View>
    );
  }
  return (
    <View className="px-5 py-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </View>
  );
}
