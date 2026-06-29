import { ChatIcon } from "@/components/icons/chat-icon";
import { DotsThreeIcon } from "@/components/icons/dots-three-icon";
import {
  HeartFilledIcon,
  HeartOutlineIcon,
} from "@/components/icons/heart-icon";
import { SirenIcon } from "@/components/icons/siren-icon";
import { TrashIcon } from "@/components/icons/trash-icon";
import { UserBlockIcon } from "@/components/icons/user-block-icon";
import { useBlockUser } from "@/features/community/hooks/use-block-user";
import { useTogglePostLike } from "@/features/community/hooks/use-post-like";
import { useReportPost } from "@/features/community/hooks/use-report-post";
import { formatDate } from "@/lib/utils";
import {
  FreePostDetailResponse,
  FreePostReportRequest,
} from "@/types/api.generated";
import { useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ImageViewerModal } from "./image-viewer-modal";
import { PostAvatar } from "./post-avatar";

const SCREEN_WIDTH = Dimensions.get("window").width;

const REASON_MAP: { label: string; value: FreePostReportRequest["reason"] }[] =
  [
    { label: "스팸", value: "SPAM" },
    { label: "욕설/혐오", value: "ABUSE" },
    { label: "음란/부적절", value: "OBSCENE" },
    { label: "허위정보", value: "FALSE_INFO" },
    { label: "기타", value: "ETC" },
  ];

type PostBodyProps = {
  post: FreePostDetailResponse;
  currentUserNickname?: string;
  onDelete?: () => void;
  onCommentPress?: () => void;
};

export function PostBody({
  post,
  currentUserNickname,
  onDelete,
  onCommentPress,
}: PostBodyProps) {
  const { mutate: toggleLike } = useTogglePostLike(post.id!);
  const { mutate: reportPost } = useReportPost(post.id!);
  const { mutate: blockUser } = useBlockUser(post.id!);
  const [liked, setLiked] = useState(post.likedByMe ?? false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const [blockModalVisible, setBlockModalVisible] = useState(false);
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

  function handleBlock(): void {
    setMenuVisible(false);
    setBlockModalVisible(true);
  }

  function confirmBlock(): void {
    setBlockModalVisible(false);
    blockUser(undefined, {
      onSuccess: () =>
        Alert.alert("차단 완료", "해당 사용자를 차단했습니다."),
      onError: () =>
        Alert.alert("오류", "차단 처리 중 오류가 발생했습니다."),
    });
  }

  function handleReport(): void {
    setMenuVisible(false);
    Alert.alert("신고 사유 선택", "신고 사유를 선택해주세요.", [
      ...REASON_MAP.map(({ label, value }) => ({
        text: label,
        onPress: () =>
          reportPost(value, {
            onSuccess: () =>
              Alert.alert(
                "신고 완료",
                "정상적으로 신고 접수되었습니다.\n\n신고된 게시글은 커뮤니티 가이드라인에 따라 모니터링 및 조치될 예정입니다.",
              ),
            onError: () =>
              Alert.alert("오류", "신고 처리 중 오류가 발생했습니다."),
          }),
      })),
      { text: "취소", style: "cancel" as const },
    ]);
  }

  return (
    <View className="gap-3 px-5 py-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <PostAvatar size="lg" imageUrl={post.author?.profileUrl} />
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

      {post.images && post.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {[...post.images]
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((img) => (
                <Pressable
                  key={img.id}
                  onPress={() => setSelectedImage(img.imageUrl ?? null)}
                >
                  {img.imageUrl ? (
                    <Image
                      source={{ uri: img.imageUrl }}
                      style={{ width: 148, height: 148, borderRadius: 12 }}
                      contentFit="cover"
                    />
                  ) : (
                    <View
                      className="rounded-xl bg-fill-stronger"
                      style={{ width: 148, height: 148 }}
                    />
                  )}
                </Pressable>
              ))}
          </View>
        </ScrollView>
      )}

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
          {liked ? (
            <HeartFilledIcon size={20} />
          ) : (
            <HeartOutlineIcon size={20} />
          )}
          <Text className="text-label-subtle typo-body-1-normal-medium">
            {post.likeCount ?? 0}
          </Text>
        </Pressable>
        <Pressable className="flex-row items-center gap-1" onPress={onCommentPress} hitSlop={8}>
          <ChatIcon size={20} color="#464a57" />
          <Text className="text-label-subtle typo-body-1-normal-medium">
            {post.commentCount ?? 0}
          </Text>
        </Pressable>
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

                <View style={{ height: 1, backgroundColor: "#f0f0f0" }} />
                <Pressable
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
                </Pressable>
              </>
            )}
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={blockModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          <View
            className="bg-fill-normal"
            style={{
              borderRadius: 16,
              padding: 24,
              gap: 24,
            }}
          >
            <View style={{ gap: 8 }}>
              <Text className="typo-heading-1-semi-bold text-label-normal">
                사용자를 차단할까요?
              </Text>
              <Text className="typo-body-1-normal-regular text-label-normal">
                차단한 사용자는 [마이페이지 {">"} 차단목록]에서 관리할 수 있어요.
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View
                className="bg-fill-stronger"
                style={{ flex: 1, height: 52, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
              >
                <Pressable
                  onPress={() => setBlockModalVisible(false)}
                  style={({ pressed }) => ({
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text className="typo-label-large text-label-subtle">
                    취소
                  </Text>
                </Pressable>
              </View>
              <View
                className="bg-status-negative-normal"
                style={{ flex: 1, height: 52, borderRadius: 10, justifyContent: "center", alignItems: "center" }}
              >
                <Pressable
                  onPress={confirmBlock}
                  style={({ pressed }) => ({
                    position: "absolute",
                    top: 0, left: 0, right: 0, bottom: 0,
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Text className="typo-label-large text-label-normal-inverse">
                    차단하기
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <ImageViewerModal
        uri={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
}
