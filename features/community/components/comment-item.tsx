import { useBlockUser } from "@/features/community/hooks/use-block-user";
import { useCommentReplies } from "@/features/community/hooks/use-comment-replies";
import { useDeleteComment } from "@/features/community/hooks/use-delete-comment";
import { ApiError } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { CommentResponse } from "@/types/api.generated";
import { ActionSheetIOS, Alert, Platform, Pressable, Text, View } from "react-native";
import { PostAvatar } from "./post-avatar";

function confirmDelete(onConfirm: () => void): void {
  Alert.alert("댓글 삭제", "삭제하시겠습니까?", [
    { text: "취소", style: "cancel" },
    { text: "삭제", style: "destructive", onPress: onConfirm },
  ]);
}

function showBlockSheet(onBlock: () => void): void {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["취소", "차단하기"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (index) => {
        if (index === 1) onBlock();
      },
    );
  } else {
    Alert.alert("차단하기", "해당 사용자를 차단하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "차단하기", style: "destructive", onPress: onBlock },
    ]);
  }
}


type ReplyItemProps = {
  reply: CommentResponse;
  postId: number;
  parentCommentId: number;
  currentUserNickname?: string;
  onReplyPress: (
    commentId: number,
    authorId: number,
    authorName: string,
  ) => void;
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
  const { mutate: blockUser } = useBlockUser(postId);

  function handleLongPress(): void {
    if (isAuthor) return;
    showBlockSheet(() =>
      blockUser(undefined, {
        onSuccess: () => Alert.alert("차단 완료", "해당 사용자를 차단했습니다."),
        onError: (error) => {
          if (error instanceof ApiError && error.statusCode === 400) {
            Alert.alert("차단 불가", "자기 자신은 차단할 수 없습니다.");
          } else {
            Alert.alert("오류", "차단 처리 중 오류가 발생했습니다.");
          }
        },
      }),
    );
  }

  return (
    <Pressable
      className="flex-row gap-2 py-3 pl-[38px]"
      onLongPress={handleLongPress}
      delayLongPress={400}
    >
      <PostAvatar size="sm" imageUrl={reply.author?.profileUrl} />
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
              onReplyPress(
                parentCommentId,
                reply.author?.id ?? 0,
                reply.author?.nickname ?? "",
              )
            }
          >
            <Text className="text-neutral-500 typo-label-small">답글 달기</Text>
          </Pressable>
          {isAuthor && (
            <Pressable
              hitSlop={8}
              onPress={() => confirmDelete(() => deleteComment(reply.id!))}
            >
              <Text className="text-neutral-500 typo-label-small">삭제</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

type CommentItemProps = {
  comment: CommentResponse;
  postId: number;
  currentUserNickname?: string;
  onReplyPress: (
    commentId: number,
    authorId: number,
    authorName: string,
  ) => void;
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
  const { mutate: blockUser } = useBlockUser(postId);
  const { data: replies = [] } = useCommentReplies(comment.id!);

  function handleLongPress(): void {
    if (isAuthor) return;
    showBlockSheet(() =>
      blockUser(undefined, {
        onSuccess: () => Alert.alert("차단 완료", "해당 사용자를 차단했습니다."),
        onError: (error) => {
          if (error instanceof ApiError && error.statusCode === 400) {
            Alert.alert("차단 불가", "자기 자신은 차단할 수 없습니다.");
          } else {
            Alert.alert("오류", "차단 처리 중 오류가 발생했습니다.");
          }
        },
      }),
    );
  }

  return (
    <View>
      <Pressable
        className="flex-row gap-2 py-3"
        onLongPress={handleLongPress}
        delayLongPress={400}
      >
        <PostAvatar size="md" imageUrl={comment.author?.profileUrl} />
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
                onReplyPress(
                  comment.id!,
                  comment.author?.id ?? 0,
                  comment.author?.nickname ?? "",
                )
              }
            >
              <Text className="text-neutral-500 typo-label-small">
                답글 달기
              </Text>
            </Pressable>
            {isAuthor && (
              <Pressable
                hitSlop={8}
                onPress={() => confirmDelete(() => deleteComment(comment.id!))}
              >
                <Text className="text-neutral-500 typo-label-small">삭제</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Pressable>
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
