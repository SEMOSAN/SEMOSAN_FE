import { useDeletePost } from "@/features/community/hooks/use-delete-post";
import { useFreePostDetail } from "@/features/community/hooks/use-free-post-detail";
import { useProfile } from "@/features/mypage/hooks/use-profile";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommentInputBar, CommentInputBarRef } from "./comment-input-bar";
import { CommentList } from "./comment-list";
import { PostBody } from "./post-body";
import { PostDetailHeader } from "./post-detail-header";

type ReplyTarget = {
  commentId: number;
  authorId: number;
  authorName: string;
};

type FreeBoardDetailScreenProps = {
  postId: number;
};

export function FreeBoardDetailScreen({ postId }: FreeBoardDetailScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const inputBarRef = useRef<CommentInputBarRef>(null);

  const { data: post } = useFreePostDetail(postId);
  const { data: profile } = useProfile();
  const { mutate: deletePost } = useDeletePost(postId);

  function handleReplyPress(
    commentId: number,
    authorId: number,
    authorName: string,
  ): void {
    setReplyTarget({ commentId, authorId, authorName });
  }

  function handleDeletePost(): void {
    deletePost(undefined, { onSuccess: () => router.back() });
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
          {post && (
            <PostBody
              post={post}
              currentUserNickname={profile?.nickname}
              onEdit={() =>
                router.push({
                  pathname: "/community/free-board/write",
                  params: { id: String(postId) },
                })
              }
              onDelete={handleDeletePost}
              onCommentPress={() => inputBarRef.current?.focus()}
            />
          )}
          <View className="h-[6px] bg-fill-strong" />
          <CommentList
            postId={postId}
            currentUserNickname={profile?.nickname}
            onReplyPress={handleReplyPress}
          />
        </ScrollView>
        <CommentInputBar
          ref={inputBarRef}
          postId={postId}
          replyTarget={replyTarget}
          onReplyCancel={() => setReplyTarget(null)}
        />
      </KeyboardAvoidingView>
    </View>
  );
}
