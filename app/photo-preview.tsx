import { IconSymbol } from "@/components/ui/icon-symbol";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhotoPreviewScreen() {
  const router = useRouter();
  const { uri, source } = useLocalSearchParams<{ uri: string; source: "camera" | "gallery" }>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(source === "gallery"); // 갤러리에서 온 건 이미 저장됨

  async function saveToAlbum() {
    setSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "앨범 저장을 위해 미디어 라이브러리 권한이 필요합니다.");
        return;
      }
      await MediaLibrary.saveToLibraryAsync(uri);
      setSaved(true);
      Alert.alert("저장 완료", "사진이 앨범에 저장되었습니다.");
    } catch {
      Alert.alert("오류", "사진 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (!uri) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>사진을 불러올 수 없습니다.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* 사진 꽉차게 */}
      <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="contain" />

      {/* 어두운 오버레이 (상/하단만) */}
      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* 상단: 뒤로가기 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {source === "gallery" ? "갤러리 사진" : "촬영된 사진"}
          </Text>
          <View style={styles.iconButton} />
        </View>

        {/* 하단: 저장 버튼 (카메라 촬영 사진만) */}
        <View style={styles.bottomBar}>
          {source === "camera" && (
            <TouchableOpacity
              style={[styles.saveButton, saved && styles.savedButton]}
              onPress={saveToAlbum}
              disabled={saving || saved}
            >
              <IconSymbol
                name={saved ? "checkmark.circle.fill" : "square.and.arrow.down.fill"}
                size={20}
                color="white"
              />
              <Text style={styles.saveButtonText}>
                {saving ? "저장 중..." : saved ? "저장됨" : "앨범에 저장"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 16,
  },
  errorText: {
    color: "white",
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 12,
  },
  savedButton: {
    backgroundColor: "#16A34A",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  backButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
