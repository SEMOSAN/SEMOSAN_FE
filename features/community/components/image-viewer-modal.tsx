import { CloseIcon } from "@/components/icons/close-icon";
import { Image } from "expo-image";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ImageViewerModalProps = {
  uri: string | null;
  onClose: () => void;
};

export function ImageViewerModal({ uri, onClose }: ImageViewerModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={!!uri}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/90"
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()} className="w-full">
          {uri ? (
            <Image
              source={{ uri }}
              style={{ width: "100%", aspectRatio: 1 }}
              contentFit="contain"
            />
          ) : null}
        </Pressable>
      </Pressable>
      <Pressable
        onPress={onClose}
        hitSlop={12}
        className="absolute right-5 items-center justify-center"
        style={{ top: insets.top + 12 }}
      >
        <CloseIcon size={24} color="#ffffff" />
      </Pressable>
    </Modal>
  );
}
