import { ChatIcon } from "@/components/icons/chat-icon";
import { EyeIcon } from "@/components/icons/eye-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { FreePostListResponse } from "@/types/api.generated";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StatItem } from "./stat-item";
import { Thumbnail } from "./thumbnail";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, ".");
}

export function PostItem({ post }: { post: FreePostListResponse }) {
  const hasImage = !!post.representativeImageUrl;
  const router = useRouter();
  return (
    <Pressable
      className="border-b border-line-subtle px-5 py-4"
      onPress={() => router.push(`/community/free-board/${post.id}`)}
    >
      <View className="gap-3">
        <View className={`flex-row ${hasImage ? "gap-3" : ""}`}>
          <View className="flex-1 gap-1">
            <Text
              className="text-label-normal typo-body-1-normal-semi-bold"
              numberOfLines={1}
            >
              {post.title}
            </Text>
            <Text
              className="text-label-subtle typo-body-2-reading-regular"
              numberOfLines={2}
            >
              {post.contentPreview}
            </Text>
          </View>
          {hasImage && <Thumbnail imageUrl={post.representativeImageUrl!} />}
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-label-subtler typo-caption-1-regular">
            {formatDate(post.createdAt)}
          </Text>
          <View className="flex-row gap-3">
            <StatItem icon={<EyeIcon />} count={post.viewCount ?? 0} />
            <StatItem
              icon={<HeartIcon size={14} color="#73798c" />}
              count={post.likeCount ?? 0}
            />
            <StatItem icon={<ChatIcon />} count={post.commentCount ?? 0} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
