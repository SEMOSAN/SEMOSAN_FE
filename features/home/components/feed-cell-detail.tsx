import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { MountainChipIcon } from "@/components/icons/mountain-chip-icon";
import { XIcon } from "@/components/icons/x-icon";
import { Image, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EMOJIS = [
  { emoji: "1", count: 14 },
  { emoji: "2", count: 14 },
  { emoji: "3", count: 14 },
  { emoji: "4", count: 14 },
] as const;

type FeedCellDetailProps = {
  imageUri: string;
  onClose: () => void;
};

export function FeedCellDetail({
  imageUri,
  onClose,
}: FeedCellDetailProps): React.ReactElement {
  const { top, bottom } = useSafeAreaInsets();

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
            style={styles.buttonShadow}
          >
            <ChevronLeftIcon size={24} color="#ffffff" />
          </Pressable>
          <Pressable
            onPress={onClose}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#1a1b1f]"
            style={styles.buttonShadow}
          >
            <XIcon size={24} color="#ffffff" />
          </Pressable>
        </View>
        <View className="w-full items-center">
          {/* 이미지 + 프로필: 헤더 아래 20px에서 시작 */}
          <Pressable
            className="items-center"
            style={{ paddingTop: top + 76 }}
            onPress={() => {}}
          >
            {/* 이미지·프로필을 같은 너비로 묶어 프로필이 이미지 왼쪽 기준 정렬 */}
            <View className="w-[288px] items-start">
              <View className="h-[512px] w-full overflow-hidden rounded-[20px]">
                <Image
                  source={{ uri: imageUri }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {/* 산 칩 */}
                <View className="absolute right-4 top-4 flex-row items-center gap-1 rounded-full bg-[rgba(26,27,31,0.6)] py-[5px] pl-[5px] pr-[10px]">
                  <MountainChipIcon size={18} />
                  <Text className="text-label-normal-inverse typo-caption-1-semi-bold">
                    관악산
                  </Text>
                </View>
              </View>

              {/* 프로필 */}
              <View className="mb-5 mt-5 flex-row items-center gap-2 px-1">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-fill-normal" />
                <Text className="text-label-normal-inverse typo-body-2-normal-semi-bold">
                  나는야엄홍길
                </Text>
              </View>
            </View>
          </Pressable>

          {/* 이모지 반응 */}
          <Pressable
            className="flex-row justify-center gap-2"
            style={{ paddingBottom: bottom + 24 }}
            onPress={() => {}}
          >
            {EMOJIS.map(({ emoji, count }) => (
              <Pressable
                key={emoji}
                className="h-10 w-[70px] flex-row items-center justify-center gap-1 rounded-full bg-white/10"
              >
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
                <Text className="text-label-normal-inverse typo-body-2-normal-semi-bold">
                  {count}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonShadow: {
    boxShadow: "0px 2px 2px rgba(0,0,0,0.1)",
    elevation: 2,
  },
});
