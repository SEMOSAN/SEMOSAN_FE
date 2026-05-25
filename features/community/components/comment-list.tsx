import { ActivityIndicator, Text, View } from "react-native";
import { usePostComments } from "../hooks/use-post-comments";
import { CommentItem } from "./comment-item";

type CommentListProps = {
  postId: number;
  currentUserNickname?: string;
  onReplyPress: (commentId: number, authorName: string) => void;
};

export function CommentList({
  postId,
  currentUserNickname,
  onReplyPress,
}: CommentListProps) {
  const { data, isPending, isError } = usePostComments(postId);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return null;
  }

  if (!data.content || data.content.length === 0) {
    return (
      <View className="flex-1 items-center justify-center pb-5 pt-10">
        <Text className="text-center text-label-subtler typo-body-1-normal-medium">
          {"아직 댓글이 없어요.\n가장 먼저 댓글을 남겨보세요!"}
        </Text>
      </View>
    );
  }
  return (
    <View className="px-5 py-3">
      {data.content.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserNickname={currentUserNickname}
          onReplyPress={onReplyPress}
        />
      ))}
    </View>
  );
}
