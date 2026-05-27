import { DownloadSimpleIcon } from "@/components/icons/download-simple-icon";
import { GlobeSimpleIcon } from "@/components/icons/globe-simple-icon";
import { LockIcon } from "@/components/icons/lock-icon";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  isPublic: boolean;
  onTogglePublic: () => void;
  onSave: () => void;
};

export function CliveBottomBar({ isPublic, onTogglePublic, onSave }: Props) {
  return (
    <View
      className="flex-row items-center justify-end"
      style={{ height: 38, paddingHorizontal: 24, gap: 12, marginTop: 12 }}
    >
      <TouchableOpacity
        className="flex-row items-center"
        style={{ width: 125, height: 38, gap: 8 }}
        hitSlop={8}
        onPress={onTogglePublic}
      >
        <Text className="typo-body-2-normal-medium text-label-subtle">
          {isPublic ? "전체 공개" : "나만 보기"}
        </Text>
        <View
          style={{
            width: 68,
            height: 38,
            borderRadius: 999,
            backgroundColor: isPublic ? "#2F323A" : "#D1D5DB",
            padding: 3,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: isPublic ? "flex-end" : "flex-start",
            }}
          >
            {isPublic ? (
              <GlobeSimpleIcon size={16} color="#1A1B1F" />
            ) : (
              <LockIcon size={16} color="#73798C" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: 38,
          height: 38,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
        hitSlop={8}
        onPress={onSave}
      >
        <DownloadSimpleIcon size={20} color="#1A1B1F" />
      </TouchableOpacity>
    </View>
  );
}
