import { ChatIcon } from "@/components/icons/chat-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { useTogglePostLike } from "@/features/community/hooks/use-post-like";
import { FreePostDetailResponse } from "@/types/api.generated";
import { Pressable, Text, View } from "react-native";
import { PostAvatar } from "./post-avatar";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, ".");
}

type PostBodyProps = {
  post: FreePostDetailResponse;
};

export function PostBody({ post }: PostBodyProps) {
  const { mutate: toggleLike } = useTogglePostLike(post.id!);

  return (
    <View className="gap-3 px-5 py-4">
      <View className="flex-row items-center gap-2">
        <PostAvatar size="lg" />
        <View>
          <Text className="typo-body-2-normal-semi-bold text-label-normal">
            {post.author?.nickname ?? ""}
          </Text>
          <Text className="typo-caption-1-regular text-label-subtler">
            {formatDate(post.createdAt)}
          </Text>
        </View>
      </View>
      <View className="gap-2">
        <Text className="typo-body-1-normal-semi-bold text-label-normal">
          {post.title}
        </Text>
        <Text className="typo-body-2-reading-regular text-label-subtle">
          {post.content}
        </Text>
      </View>
      <View className="flex-row gap-3">
        <Pressable
          className="flex-row items-center gap-1"
          onPress={() => toggleLike()}
          hitSlop={8}
        >
          <HeartIcon size={20} color="#464a57" />
          <Text className="typo-body-1-normal-medium text-label-subtle">
            {post.likeCount ?? 0}
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-1">
          <ChatIcon size={20} color="#464a57" />
          <Text className="typo-body-1-normal-medium text-label-subtle">
            {post.commentCount ?? 0}
          </Text>
        </View>
      </View>
    </View>
  );
}
