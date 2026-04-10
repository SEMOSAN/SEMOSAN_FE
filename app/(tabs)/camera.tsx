import { IconSymbol } from "@/components/ui/icon-symbol";
import { useLocation } from "@/hooks/use-location";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CameraScreen() {
  const router = useRouter();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flashOn, setFlashOn] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  const {
    location,
    errorMsg: locationError,
    loading: locationLoading,
    permissionGranted,
    requestPermission: requestLocationPermission,
    getCurrentLocation,
  } = useLocation();

  // 갤러리에서 사진 선택
  async function pickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("권한 필요", "갤러리 접근을 위해 권한이 필요합니다.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets.length > 0) {
      router.push({
        pathname: "/photo-preview",
        params: { uri: result.assets[0].uri, source: "gallery" },
      });
    }
  }

  // 사진 촬영 → 앨범 자동 저장 → 미리보기
  async function takePicture() {
    if (!cameraRef.current || isTaking) return;
    setIsTaking(true);
    try {
      const [photo, gps] = await Promise.all([
        cameraRef.current.takePictureAsync({ quality: 1 }),
        getCurrentLocation(),
      ]);

      if (!photo) return;

      // 앨범 저장 권한 확인 후 저장
      const permStatus =
        mediaPermission?.status === "granted"
          ? "granted"
          : (await requestMediaPermission()).status;

      if (permStatus === "granted") {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      }

      if (gps) {
        console.log(
          `GPS: ${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)} ±${gps.accuracy?.toFixed(0)}m`
        );
      }

      // 미리보기 화면으로 이동
      router.push({
        pathname: "/photo-preview",
        params: { uri: photo.uri, source: "camera" },
      });
    } catch {
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
    } finally {
      setIsTaking(false);
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlash() {
    setFlashOn((prev) => !prev);
  }

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>카메라 권한이 필요합니다</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>권한 허용하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 카메라 */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={flashOn ? "on" : "off"}
      />

      {/* 카메라 위에 올라가는 UI */}
      <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
        {/* 상단 컨트롤 */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash}>
            <IconSymbol
              name={flashOn ? "bolt.fill" : "bolt.slash.fill"}
              size={24}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>세모산 화이팅</Text>
          </View>

          <TouchableOpacity style={styles.iconButton} onPress={toggleCameraFacing}>
            <IconSymbol
              name="arrow.triangle.2.circlepath.camera"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* GPS 위치 표시 */}
        <View style={styles.locationBar}>
          {!permissionGranted ? (
            <TouchableOpacity onPress={requestLocationPermission} style={styles.locationRow}>
              <IconSymbol name="location.slash.fill" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.locationText}>위치 권한 허용하기</Text>
            </TouchableOpacity>
          ) : locationLoading ? (
            <View style={styles.locationRow}>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.locationText}>위치 불러오는 중...</Text>
            </View>
          ) : location ? (
            <View style={styles.locationRow}>
              <IconSymbol name="location.fill" size={14} color="#4ADE80" />
              <Text style={styles.locationText}>
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
              {location.accuracy != null && (
                <Text style={styles.accuracyText}>±{location.accuracy.toFixed(0)}m</Text>
              )}
            </View>
          ) : locationError ? (
            <View style={styles.locationRow}>
              <IconSymbol name="location.slash.fill" size={14} color="#F87171" />
              <Text style={[styles.locationText, { color: "#F87171" }]}>{locationError}</Text>
            </View>
          ) : null}
        </View>

        {/* 가운데 가이드 프레임 */}
        <View style={styles.frameGuide}>
          <View style={styles.corner} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        {/* 하단 컨트롤 */}
        <View style={styles.bottomBar}>
          {/* 갤러리 버튼 */}
          <TouchableOpacity style={styles.galleryButton} onPress={pickFromGallery}>
            <IconSymbol name="photo.on.rectangle" size={28} color="white" />
          </TouchableOpacity>

          {/* 셔터 버튼 */}
          <Pressable
            style={({ pressed }) => [
              styles.shutter,
              (pressed || isTaking) && styles.shutterPressed,
            ]}
            onPress={takePicture}
            disabled={isTaking}
          >
            {isTaking ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <View style={styles.shutterInner} />
            )}
          </Pressable>

          {/* 오른쪽 여백 */}
          <View style={styles.sideButton} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const CORNER_SIZE = 28;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    gap: 16,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
  },
  permissionButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },

  // 상단 바
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  iconButton: {
    padding: 10,
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },

  // GPS 위치 바
  locationBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationText: {
    color: "white",
    fontSize: 12,
    fontVariant: ["tabular-nums"],
  },
  accuracyText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
  },

  // 가운데 가이드 프레임
  frameGuide: {
    width: 240,
    height: 240,
    alignSelf: "center",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: "white",
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    top: 0,
    left: undefined,
    right: 0,
    borderLeftWidth: 0,
    borderRightWidth: CORNER_THICKNESS,
  },
  cornerBottomLeft: {
    top: undefined,
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderBottomWidth: CORNER_THICKNESS,
  },
  cornerBottomRight: {
    top: undefined,
    bottom: 0,
    left: undefined,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomWidth: CORNER_THICKNESS,
  },

  // 하단 바
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  galleryButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  sideButton: {
    width: 48,
    height: 48,
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
  },
});
