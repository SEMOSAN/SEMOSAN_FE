import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { setPhotoReportState } from "@/features/photo-report/photo-report-state";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CaretLeftIcon } from "@/components/icons/caret-left-icon";
import { CaretRightIcon } from "@/components/icons/caret-right-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { ChevronLeftIcon } from "@/components/icons/chevron-left-icon";
import { ImageIcon } from "@/components/icons/image-icon";
import { XIcon } from "@/components/icons/x-icon";

const SCREEN_WIDTH = Dimensions.get("window").width;

const CARD_W = 240;
const CARD_H = 426;
const CARD_GAP = 12;
const CARD_PEEK = (SCREEN_WIDTH - CARD_W) / 2;

const NAV_BTN_SIZE = 38;
const NAV_BTN_TOP = 12 + (CARD_H - NAV_BTN_SIZE) / 2;

const THUMB_SIZE = 85;

const OVERLAY_TEMPLATES = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
];

const OVERLAY_STATS = [
  require("@/assets/overlay-stats-1.png"),
  require("@/assets/overlay-stats-2.png"),
  require("@/assets/overlay-stats-3.png"),
];

const PhotoReportBg = require("@/assets/photo-report-bg.png");

type Photo = { key: string; source: number | { uri: string } };

const INITIAL_PHOTOS: Photo[] = [
  { key: "thumb-1", source: require("@/assets/photo-thumb-1.jpg") },
  { key: "thumb-2", source: require("@/assets/photo-thumb-2.png") },
  { key: "thumb-3", source: require("@/assets/photo-thumb-3.jpg") },
];

export default function PhotoReportEditScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollTo = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * (CARD_W + CARD_GAP),
      animated: true,
    });
  };

  const handleLeft = () => {
    if (selectedTemplate > 0) {
      const next = selectedTemplate - 1;
      setSelectedTemplate(next);
      scrollTo(next);
    }
  };

  const handleRight = () => {
    if (selectedTemplate < OVERLAY_TEMPLATES.length - 1) {
      const next = selectedTemplate + 1;
      setSelectedTemplate(next);
      scrollTo(next);
    }
  };

  const handleTemplatePress = (index: number) => {
    setSelectedTemplate(index);
    scrollTo(index);
  };

  const handleImport = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
      orderedSelection: true,
    });

    if (!result.canceled && result.assets.length > 0) {
      const newPhotos: Photo[] = result.assets.map((a) => ({
        key: a.uri,
        source: { uri: a.uri },
      }));
      setPhotos((prev) => [...newPhotos, ...prev]);
      setSelectedPhoto(0);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* 헤더 */}
      <View style={{ paddingTop: top }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
            <ChevronLeftIcon size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowExitDialog(true)} hitSlop={8}>
            <XIcon size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 템플릿 카드 + 좌우 버튼 */}
      <View style={styles.templateContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: CARD_PEEK,
            gap: CARD_GAP,
            alignItems: "center",
            height: CARD_H + 24,
            paddingVertical: 12,
          }}
          style={styles.templateScroll}
        >
          {OVERLAY_TEMPLATES.map((template, index) => (
            <TouchableOpacity
              key={template.id}
              activeOpacity={0.9}
              onPress={() => handleTemplatePress(index)}
              style={{ opacity: selectedTemplate === index ? 1 : 0.4 }}
            >
              <View style={styles.templateCard}>
                <ExpoImage
                  key={selectedPhoto ?? "default"}
                  source={
                    selectedPhoto !== null
                      ? photos[selectedPhoto].source
                      : PhotoReportBg
                  }
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                />
                <ExpoImage
                  source={OVERLAY_STATS[index]}
                  style={StyleSheet.absoluteFill}
                  contentFit="cover"
                  pointerEvents="none"
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 왼쪽 버튼 */}
        {selectedTemplate > 0 && (
          <TouchableOpacity
            style={[styles.navBtn, { left: 16, top: NAV_BTN_TOP }]}
            onPress={handleLeft}
            activeOpacity={0.8}
          >
            <CaretLeftIcon color="#1A1B1F" />
          </TouchableOpacity>
        )}

        {/* 오른쪽 버튼 */}
        {selectedTemplate < OVERLAY_TEMPLATES.length - 1 && (
          <TouchableOpacity
            style={[styles.navBtn, { right: 16, top: NAV_BTN_TOP }]}
            onPress={handleRight}
            activeOpacity={0.8}
          >
            <CaretRightIcon size={24} color="#1A1B1F" />
          </TouchableOpacity>
        )}
      </View>

      {/* 사진 선택 행 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoRow}
        style={styles.photoRowScroll}
      >
        {/* 가져오기 */}
        <TouchableOpacity
          style={styles.importBtn}
          activeOpacity={0.7}
          onPress={handleImport}
        >
          <ImageIcon size={24} color="#73798C" />
          <Text style={styles.importLabel}>가져오기</Text>
        </TouchableOpacity>

        {/* 사진 썸네일 */}
        {photos.map((photo, index) => (
          <TouchableOpacity
            key={photo.key}
            style={styles.thumbWrap}
            onPress={() => setSelectedPhoto(index)}
            activeOpacity={0.8}
          >
            <ExpoImage
              source={photo.source}
              style={styles.thumb}
              contentFit="cover"
            />
            <View
              style={[
                styles.selectOverlay,
                selectedPhoto === index
                  ? styles.selectOverlayActive
                  : styles.selectOverlayInactive,
              ]}
            >
              {selectedPhoto === index && (
                <CheckCircleIcon size={20} color="#00D864" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 편집 종료 확인 다이얼로그 */}
      <Modal
        visible={showExitDialog}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowExitDialog(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowExitDialog(false)}>
          <View style={styles.dialogOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dialog}>
                <View style={styles.dialogContent}>
                  <Text style={styles.dialogTitle}>편집을 그만할까요?</Text>
                </View>
                <View style={styles.dialogBtnArea}>
                  <TouchableOpacity
                    style={styles.dialogBtnCancel}
                    activeOpacity={0.7}
                    onPress={() => setShowExitDialog(false)}
                  >
                    <Text style={styles.dialogBtnCancelText}>계속 편집</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dialogBtnConfirm}
                    activeOpacity={0.7}
                    onPress={() => router.back()}
                  >
                    <Text style={styles.dialogBtnConfirmText}>그만하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 완료 버튼 */}
      <View style={[styles.bottomBar, { paddingBottom: bottom || 16 }]}>
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => {
            const photo = selectedPhoto !== null ? photos[selectedPhoto] : null;
            setPhotoReportState({
              photoSource: photo ? photo.source : null,
              templateIndex: selectedTemplate,
            });
            router.back();
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.doneBtnText}>완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 20,
  },
  templateContainer: {
    position: "relative",
  },
  templateScroll: {
    flexGrow: 0,
  },
  templateCard: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    overflow: "hidden",
  },
  navBtn: {
    position: "absolute",
    width: NAV_BTN_SIZE,
    height: NAV_BTN_SIZE,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  photoRowScroll: {
    flexGrow: 0,
    marginTop: 24,
  },
  photoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 8,
    gap: 8,
  },
  importBtn: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  importLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#73798C",
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 8,
    overflow: "hidden",
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  selectOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    paddingTop: 4,
    paddingRight: 4,
    alignItems: "flex-end",
  },
  selectOverlayActive: {
    borderWidth: 2,
    borderColor: "#00D864",
  },
  selectOverlayInactive: {
    borderWidth: 0,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },
  dialogContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000C1E",
  },
  dialogBtnArea: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  dialogBtnCancel: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#F0F1F4",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogBtnCancelText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#464A57",
  },
  dialogBtnConfirm: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: "#1A1B1F",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogBtnConfirmText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  doneBtn: {
    height: 56,
    backgroundColor: "#1A1B1F",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  doneBtnText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
