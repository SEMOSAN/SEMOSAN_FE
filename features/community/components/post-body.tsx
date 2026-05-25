import { ChatIcon } from "@/components/icons/chat-icon";
import { DotsThreeIcon } from "@/components/icons/dots-three-icon";
import { SirenIcon } from "@/components/icons/siren-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { UserBlockIcon } from "@/components/icons/user-block-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { useTogglePostLike } from "@/features/community/hooks/use-post-like";
import { FreePostDetailResponse } from "@/types/api.generated";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

function formatDate(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, ".");
}

type PostBodyProps = {
  post: FreePostDetailResponse;
  currentUserNickname?: string;
  onDelete?: () => void;
};

export function PostBody({ post, currentUserNickname, onDelete }: PostBodyProps) {
  const { mutate: toggleLike } = useTogglePostLike(post.id!);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const isAuthor =
    !!currentUserNickname &&
    post.author?.nickname === currentUserNickname;

  function handleMenuPress(): void {
    buttonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      setMenuPos({
        top: pageY + height + 4,
        right: SCREEN_WIDTH - pageX - width,
      });
      setMenuVisible(true);
    });
  }

  function handleDelete(): void {
    setMenuVisible(false);
    Alert.alert("게시글 삭제", "삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }

  function handleReport(): void {
    setMenuVisible(false);
    Alert.alert("신고하기", "이 게시글을 신고하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "신고", style: "destructive", onPress: () => {} },
    ]);
  }

  function handleBlock(): void {
    setMenuVisible(false);
    Alert.alert("차단하기", "이 사용자를 차단하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "차단", style: "destructive", onPress: () => {} },
    ]);
  }

  return (
    <View className="gap-3 px-5 py-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <View className="size-10 rounded-full bg-fill-strong" />
          <View>
            <Text className="typo-body-2-normal-semi-bold text-label-normal">
              {post.author?.nickname ?? ""}
            </Text>
            <Text className="typo-caption-1-regular text-label-subtler">
              {formatDate(post.createdAt)}
            </Text>
          </View>
        </View>
        <Pressable ref={buttonRef} onPress={handleMenuPress} hitSlop={8}>
          <View style={{ transform: [{ rotate: "90deg" }] }}>
            <DotsThreeIcon size={20} color="#73798c" />
          </View>
        </Pressable>
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

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: menuPos.top,
              right: menuPos.right,
              minWidth: 140,
              backgroundColor: "#ffffff",
              borderRadius: 8,
              paddingVertical: 8,
              paddingHorizontal: 12,
              gap: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 25,
              elevation: 6,
            }}
          >
            {isAuthor ? (
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 2,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <TrashIcon size={16} color="#ff5249" />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#ff5249",
                    lineHeight: 19.5,
                  }}
                >
                  삭제하기
                </Text>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={handleReport}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    paddingHorizontal: 2,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <SirenIcon size={16} color="#73798c" />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#73798c",
                      lineHeight: 19.5,
                    }}
                  >
                    신고하기
                  </Text>
                </Pressable>
                <View style={{ height: 1, backgroundColor: "#f0f0f0" }} />
                <Pressable
                  onPress={handleBlock}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    paddingHorizontal: 2,
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <UserBlockIcon size={16} color="#73798c" />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#73798c",
                      lineHeight: 19.5,
                    }}
                  >
                    차단하기
                  </Text>
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
