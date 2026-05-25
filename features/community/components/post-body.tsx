import { ChatIcon } from "@/components/icons/chat-icon";
import { DotsThreeIcon } from "@/components/icons/dots-three-icon";
import { HeartFilledIcon, HeartIcon } from "@/components/icons/heart-icon";
import { SirenIcon } from "@/components/icons/siren-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { useTogglePostLike } from "@/features/community/hooks/use-post-like";
import { formatDate } from "@/lib/utils";
import { FreePostDetailResponse } from "@/types/api.generated";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { PostAvatar } from "./post-avatar";

const SCREEN_WIDTH = Dimensions.get("window").width;

type PostBodyProps = {
  post: FreePostDetailResponse;
  currentUserNickname?: string;
  onDelete?: () => void;
};

export function PostBody({
  post,
  currentUserNickname,
  onDelete,
}: PostBodyProps) {
  const { mutate: toggleLike } = useTogglePostLike(post.id!);
  const [liked, setLiked] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const isAuthor =
    !!currentUserNickname && post.author?.nickname === currentUserNickname;

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
    const reasons = ["스팸", "욕설/혐오", "음란/부적절", "허위정보", "기타"];
    Alert.alert("신고 사유 선택", "신고 사유를 선택해주세요.", [
      ...reasons.map((reason) => ({
        text: reason,
        onPress: () =>
          Alert.alert(
            "신고 완료",
            "정상적으로 신고 접수되었습니다.\n\n신고된 게시글은 커뮤니티 가이드라인에 따라 모니터링 및 조치될 예정입니다.",
          ),
      })),
      { text: "취소", style: "cancel" as const },
    ]);
  }

  return (
    <View className="gap-3 px-5 py-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          {post.author?.profileUrl ? (
            <Image
              source={{ uri: post.author.profileUrl }}
              className="size-10 rounded-full"
            />
          ) : (
            <PostAvatar size="lg" />
          )}
          <View>
            <Text className="text-label-normal typo-body-2-normal-semi-bold">
              {post.author?.nickname ?? ""}
            </Text>
            <Text className="text-label-subtler typo-caption-1-regular">
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
        <Text className="text-label-normal typo-body-1-normal-semi-bold">
          {post.title}
        </Text>
        <Text className="text-label-subtle typo-body-2-reading-regular">
          {post.content}
        </Text>
      </View>

      <View className="flex-row gap-3">
        <Pressable
          className="flex-row items-center gap-1"
          onPress={() =>
            toggleLike(undefined, {
              onSuccess: (res) => setLiked(res.data.liked),
            })
          }
          hitSlop={8}
        >
          {liked ? <HeartFilledIcon size={20} /> : <HeartIcon size={20} color="#464a57" />}
          <Text className="text-label-subtle typo-body-1-normal-medium">
            {post.likeCount ?? 0}
          </Text>
        </Pressable>
        <View className="flex-row items-center gap-1">
          <ChatIcon size={20} color="#464a57" />
          <Text className="text-label-subtle typo-body-1-normal-medium">
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
                  opacity: pressed ? 0.7 : 1,
                  paddingHorizontal: 2,
                })}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
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
                </View>
              </Pressable>
            ) : (
              <>
                <Pressable
                  onPress={handleReport}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    paddingHorizontal: 2,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
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
                  </View>
                </Pressable>

                {/* TODO : 차단 API 나오기 전까지 임시 주석처리 */}
                {/* <View style={{ height: 1, backgroundColor: "#f0f0f0" }} /> */}
                {/* <Pressable
                  onPress={handleBlock}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    paddingHorizontal: 2,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
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
                  </View>
                </Pressable> */}
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
