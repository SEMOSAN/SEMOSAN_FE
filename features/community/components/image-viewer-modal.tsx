import { CloseIcon } from "@/components/icons/close-icon";
import { Image, Modal, Pressable, View } from "react-native";
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
          <Image
            source={{ uri: uri ?? "" }}
            className="w-full"
            style={{ aspectRatio: 1 }}
            resizeMode="contain"
          />
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
