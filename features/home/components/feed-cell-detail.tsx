import { AvatarIcon } from "@/components/icons/avatar-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { XIcon } from "@/components/icons/x-icon";
import { SemoFeedEmojiRequest, SemoFeedResponse } from "@/types/api.generated";
import { useState } from "react";
import { Image } from "expo-image";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToggleSemofeedEmoji } from "../hooks/use-toggle-semofeed-emoji";

const EMOJI_ORDER: { key: SemoFeedEmojiRequest["emojiType"]; char: string }[] =
  [
    { key: "FIRE", char: "🔥" },
    { key: "HEART", char: "❤️" },
    { key: "CONGRATS", char: "🎉" },
    { key: "LAUGH", char: "😂" },
  ];

type FeedCellDetailProps = {
  item: SemoFeedResponse;
  onClose: () => void;
};

export function FeedCellDetail({
  item,
  onClose,
}: FeedCellDetailProps): React.ReactElement {
  const { top, bottom } = useSafeAreaInsets();
  const imageUrl = item.imageUrl?.replace(/"/g, "");

  const [counts, setCounts] = useState<Record<string, number>>(
    item.emojiCounts ?? {},
  );
  const [reacted, setReacted] = useState<Record<string, boolean>>(
    item.reactedByMe ?? {},
  );

  const [pendingEmoji, setPendingEmoji] = useState<
    SemoFeedEmojiRequest["emojiType"] | null
  >(null);

  const { mutate: toggleEmoji } = useToggleSemofeedEmoji();

  const handleEmojiPress = (
    emojiKey: SemoFeedEmojiRequest["emojiType"],
  ): void => {
    if (item.id == null || pendingEmoji !== null) return;
    setPendingEmoji(emojiKey);
    toggleEmoji(
      {
        semoFeedId: item.id,
        emojiType: emojiKey,
      },
      {
        onSuccess: (res) => {
          const { emojiType, reacted: newReacted, count } = res.data ?? {};
          if (emojiType == null || newReacted == null || count == null) return;
          setCounts((prev) => ({ ...prev, [emojiType]: count }));
          setReacted((prev) => ({ ...prev, [emojiType]: newReacted }));
        },
        onSettled: () => setPendingEmoji(null),
      },
    );
  };

  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/80" onPress={onClose}>
        {/* 헤더 */}
        <View
          className="absolute left-0 right-0 z-10 flex-row items-center justify-between px-5"
          style={{ top: top + 8 }}
        >
          <Pressable
            onPress={onClose}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#1a1b1f]"
            style={{ boxShadow: "0px 2px 2px rgba(0,0,0,0.1)" }}
          >
            <ChevronLeftIcon size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            onPress={onClose}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#1a1b1f]"
            style={{ boxShadow: "0px 2px 2px rgba(0,0,0,0.1)" }}
          >
            <XIcon size={24} color="#ffffff" />
          </Pressable>
        </View>

        <View className="w-full items-center">
          {/* 이미지 + 프로필 */}
          <Pressable
            className="items-center"
            style={{ paddingTop: top + 76 }}
            onPress={() => {}}
          >
            <View className="w-[288px] items-start">
              <View className="h-[512px] w-full overflow-hidden rounded-[20px]">
                {imageUrl ? (
                  <Image
                    source={{ uri: imageUrl }}
                    style={{ flex: 1 }}
                    contentFit="cover"
                  />
                ) : null}
              </View>

              {/* 프로필 */}
              <View className="mb-5 mt-5 flex-row items-center gap-2 px-1">
                <View className="h-8 w-8 overflow-hidden rounded-full bg-fill-normal">
                  {item.profileUrl ? (
                    <Image
                      source={{ uri: item.profileUrl }}
                      style={{ flex: 1 }}
                      contentFit="cover"
                    />
                  ) : (
                    <AvatarIcon size={32} />
                  )}
                </View>
                <Text className="text-label-normal-inverse typo-body-2-normal-semi-bold">
                  {item.nickname ?? ""}
                </Text>
              </View>
            </View>
          </Pressable>

          {/* 이모지 반응 */}
          <View
            className="flex-row justify-center gap-2"
            style={{ paddingBottom: bottom + 24 }}
          >
            {EMOJI_ORDER.map(({ key, char }) => {
              const isLoading = pendingEmoji === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => handleEmojiPress(key)}
                  disabled={pendingEmoji !== null}
                  className={`h-10 w-[70px] flex-row items-center justify-center gap-1 rounded-full ${reacted[key] ? "bg-white/25" : "bg-white/10"}`}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Text style={{ fontSize: 20 }}>{char}</Text>
                      <Text className="text-label-normal-inverse typo-body-2-normal-semi-bold">
                        {counts[key] ?? 0}
                      </Text>
                    </>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

