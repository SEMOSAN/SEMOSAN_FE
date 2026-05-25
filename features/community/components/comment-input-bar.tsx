import { CloseSmallIcon } from "@/components/icons/close-small-icon";
import { PaperPlaneIcon } from "@/components/icons/paper-plane-icon";
import { useCreateComment } from "@/features/community/hooks/use-create-comment";
import { useCreateReply } from "@/features/community/hooks/use-create-reply";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReplyTarget = {
  commentId: number;
  authorName: string;
};

type CommentInputBarProps = {
  postId: number;
  replyTarget: ReplyTarget | null;
  onReplyCancel: () => void;
};

export function CommentInputBar({
  postId,
  replyTarget,
  onReplyCancel,
}: CommentInputBarProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const { mutateAsync: createComment, isPending: isCreatingComment } =
    useCreateComment(postId);
  const { mutateAsync: createReply, isPending: isCreatingReply } =
    useCreateReply(postId);

  const isPending = isCreatingComment || isCreatingReply;

  async function handleSubmit(): Promise<void> {
    if (!text.trim() || isPending) return;
    if (replyTarget) {
      await createReply({ parentId: replyTarget.commentId, content: text.trim() });
      onReplyCancel();
    } else {
      await createComment(text.trim());
    }
    setText("");
  }

  return (
    <View
      className="border-t border-line-subtle bg-fill-normal px-4 pt-4"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      {replyTarget && (
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="typo-caption-1-regular text-label-subtler">
            {replyTarget.authorName}에게 답글 달기
          </Text>
          <Pressable onPress={onReplyCancel} hitSlop={8}>
            <CloseSmallIcon size={14} color="#8b92a6" />
          </Pressable>
        </View>
      )}
      <View className="flex-row items-end gap-2 rounded-[24px] bg-fill-strong py-2 pl-4 pr-[10px]">
        <TextInput
          className="flex-1 py-[3px] text-label-normal typo-body-1-reading-regular"
          placeholder={replyTarget ? "답글을 입력하세요" : "댓글을 입력하세요"}
          placeholderTextColor="#8b92a6"
          style={{ maxHeight: 80 }}
          multiline
          value={text}
          onChangeText={setText}
          editable={!isPending}
        />
        {text.length > 0 && (
          <Pressable
            onPress={handleSubmit}
            disabled={isPending}
            className="size-8 items-center justify-center rounded-full bg-primary-normal"
          >
            <PaperPlaneIcon />
          </Pressable>
        )}
      </View>
    </View>
  );
}
