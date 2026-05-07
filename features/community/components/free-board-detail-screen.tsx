import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Comment } from "../constants/mock-post-detail";
import { CommentInputBar } from "./comment-input-bar";
import { CommentList } from "./comment-list";
import { PostBody } from "./post-body";
import { PostDetailHeader } from "./post-detail-header";

type PostDetail = {
  author: string;
  date: string;
  title: string;
  body: string;
  likes: number;
  comments: number;
};

type FreeBoardDetailScreenProps = {
  post: PostDetail;
  commentList: Comment[];
};

export function FreeBoardDetailScreen({
  post,
  commentList,
}: FreeBoardDetailScreenProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      <PostDetailHeader />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <PostBody {...post} />
          <View className="h-[6px] bg-fill-strong" />
          <CommentList comments={commentList} />
        </ScrollView>
        <CommentInputBar />
      </KeyboardAvoidingView>
    </View>
  );
}
