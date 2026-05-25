import { useCommentReplies } from "@/features/community/hooks/use-comment-replies";
import { useDeleteComment } from "@/features/community/hooks/use-delete-comment";
import { CommentResponse } from "@/types/api.generated";
import { Alert, Pressable, Text, View } from "react-native";
import { PostAvatar } from "./post-avatar";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, ".");
}

function confirmDelete(onConfirm: () => void): void {
  Alert.alert("댓글 삭제", "삭제하시겠습니까?", [
    { text: "취소", style: "cancel" },
    { text: "삭제", style: "destructive", onPress: onConfirm },
  ]);
}

type ReplyItemProps = {
  reply: CommentResponse;
  postId: number;
  parentCommentId: number;
  currentUserNickname?: string;
  onReplyPress: (commentId: number, authorName: string) => void;
};

function ReplyItem({
  reply,
  postId,
  parentCommentId,
  currentUserNickname,
  onReplyPress,
}: ReplyItemProps) {
  const isAuthor =
    !!currentUserNickname && reply.author?.nickname === currentUserNickname;
  const { mutate: deleteComment } = useDeleteComment(postId, parentCommentId);

  return (
    <View className="flex-row gap-2 py-3 pl-[38px]">
      <PostAvatar size="sm" />
      <View className="flex-1 gap-1">
        <View className="flex-row flex-wrap items-center gap-1">
          <Text className="text-label-normal typo-caption-1-semi-bold">
            {reply.author?.nickname ?? ""}
          </Text>
          <Text className="text-label-subtler typo-caption-1-regular">
            {formatDate(reply.createdAt)}
          </Text>
        </View>
        <Text className="text-label-normal typo-body-2-reading-regular">
          {reply.content}
        </Text>
        <View className="flex-row gap-3">
          <Pressable
            hitSlop={8}
            onPress={() =>
              onReplyPress(parentCommentId, reply.author?.nickname ?? "")
            }
          >
            <Text className="text-neutral-500 typo-label-small">답글 달기</Text>
          </Pressable>
          {isAuthor && (
            <Pressable hitSlop={8} onPress={() => confirmDelete(() => deleteComment(reply.id!))}>
              <Text className="text-neutral-500 typo-label-small">삭제</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

type CommentItemProps = {
  comment: CommentResponse;
  postId: number;
  currentUserNickname?: string;
  onReplyPress: (commentId: number, authorName: string) => void;
};

export function CommentItem({
  comment,
  postId,
  currentUserNickname,
  onReplyPress,
}: CommentItemProps) {
  const isAuthor =
    !!currentUserNickname && comment.author?.nickname === currentUserNickname;
  const { mutate: deleteComment } = useDeleteComment(postId);
  const { data: replies = [] } = useCommentReplies(comment.id!);

  return (
    <View>
      <View className="flex-row gap-2 py-3">
        <PostAvatar size="md" />
        <View className="flex-1 gap-1">
          <View className="flex-row flex-wrap items-center gap-1">
            <Text className="text-label-normal typo-caption-1-semi-bold">
              {comment.author?.nickname ?? ""}
            </Text>
            <Text className="text-label-subtler typo-caption-1-regular">
              {formatDate(comment.createdAt)}
            </Text>
          </View>
          <Text className="text-label-normal typo-body-2-reading-regular">
            {comment.content}
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              hitSlop={8}
              onPress={() =>
                onReplyPress(comment.id!, comment.author?.nickname ?? "")
              }
            >
              <Text className="text-neutral-500 typo-label-small">
                답글 달기
              </Text>
            </Pressable>
            {isAuthor && (
              <Pressable hitSlop={8} onPress={() => confirmDelete(() => deleteComment(comment.id!))}>
                <Text className="text-neutral-500 typo-label-small">삭제</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          parentCommentId={comment.id!}
          currentUserNickname={currentUserNickname}
          onReplyPress={onReplyPress}
        />
      ))}
    </View>
  );
}
