import { useFreePostDetail } from "@/features/community/hooks/use-free-post-detail";
import { useProfile } from "@/features/mypage/hooks/use-profile";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommentInputBar } from "./comment-input-bar";
import { CommentList } from "./comment-list";
import { PostBody } from "./post-body";
import { PostDetailHeader } from "./post-detail-header";

type ReplyTarget = {
  commentId: number;
  authorName: string;
};

type FreeBoardDetailScreenProps = {
  postId: number;
};

export function FreeBoardDetailScreen({ postId }: FreeBoardDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);

  const { data: post } = useFreePostDetail(postId);
  const { data: profile } = useProfile();

  function handleReplyPress(commentId: number, authorName: string): void {
    setReplyTarget({ commentId, authorName });
  }

  return (
    <View className="flex-1 bg-fill-normal" style={{ paddingTop: insets.top }}>
      <PostDetailHeader />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {post && <PostBody post={post} />}
          <View className="h-[6px] bg-fill-strong" />
          <CommentList
            postId={postId}
            currentUserNickname={profile?.nickname}
            onReplyPress={handleReplyPress}
          />
        </ScrollView>
        <CommentInputBar
          postId={postId}
          replyTarget={replyTarget}
          onReplyCancel={() => setReplyTarget(null)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
