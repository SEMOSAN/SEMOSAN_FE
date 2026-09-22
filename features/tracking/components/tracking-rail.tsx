import { CameraOutlineIcon } from "@/components/icons/camera-outline-icon";
import { SemosanMarkIcon } from "@/components/icons/semosan-mark-icon";
import { Image } from "expo-image";
import { useState } from "react";
import type { TrackingPhoto } from "../tracking-photo-storage";
import { colors } from "@/constants/colors";
import { TouchableOpacity, View } from "react-native";
import { SHADOW } from "../constants";

/** 우측 레일이 시작하는 화면 y — 상단 사진 배너(top 124) 아래 */
export const TRACKING_RAIL_TOP = 240;
/** 레일 칸 수 = 세션당 최대 인증 사진 수. 찍은 사진 → 카메라 → 빈 슬롯 순으로 채운다 */
const RAIL_SLOT_COUNT = 4;
const BUTTON_SIZE = 48;

type Props = {
  isPhotoWindowOpen: boolean;
  /** 촬영→업로드→저장 진행 중. 끝날 때까지 카메라를 잠근다 */
  isBusy?: boolean;
  /** 찍은 인증 사진. 위에서부터 썸네일로 쌓인다 */
  photos: TrackingPhoto[];
  onCameraPress: () => void;
};

/** 찍은 사진 썸네일. 기기 파일이 사라졌으면 서버 URL로 폴백 */
function PhotoThumbnail({ photo }: { photo: TrackingPhoto }) {
  const [useRemote, setUseRemote] = useState(!photo.localUri);
  return (
    <View
      className="overflow-hidden rounded-xl border-2 border-label-normal-inverse bg-fill-stronger"
      style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, ...SHADOW }}
      accessibilityLabel={`인증 사진 ${photo.milestoneIndex}`}
    >
      <Image
        source={{ uri: useRemote ? photo.imageUrl : photo.localUri }}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        onError={() => setUseRemote(true)}
      />
    </View>
  );
}

/** 트래킹 중 우측 레일 — 찍은 사진 → 카메라 → 빈 슬롯 (항상 4칸) */
export function TrackingRail({
  isPhotoWindowOpen,
  isBusy = false,
  photos,
  onCameraPress,
}: Props) {
  const taken = Math.min(photos.length, RAIL_SLOT_COUNT);
  const showCamera = taken < RAIL_SLOT_COUNT;
  const emptyCount = Math.max(
    0,
    RAIL_SLOT_COUNT - taken - (showCamera ? 1 : 0),
  );

  return (
    <View className="absolute right-4 gap-2" style={{ top: TRACKING_RAIL_TOP }}>
      {/* 찍은 사진 — 위에서부터 쌓인다 */}
      {photos.slice(0, RAIL_SLOT_COUNT).map((photo) => (
        <PhotoThumbnail
          key={`${photo.milestoneIndex}-${photo.imageUrl}`}
          photo={photo}
        />
      ))}

      {/* 카메라 — 다 찍으면 사라진다 */}
      {showCamera && (
        <TouchableOpacity
          className="items-center justify-center rounded-xl bg-fill-normal"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, ...SHADOW }}
          onPress={onCameraPress}
          disabled={!isPhotoWindowOpen || isBusy}
          accessibilityLabel="인증 사진 촬영"
        >
          <CameraOutlineIcon color={colors.label.normal} />
        </TouchableOpacity>
      )}

      {/* 빈 슬롯 */}
      {Array.from({ length: emptyCount }, (_, i) => (
        <View
          key={`empty-${i}`}
          className="items-center justify-center rounded-xl border-2 border-label-normal-inverse bg-fill-stronger"
          style={{ width: BUTTON_SIZE, height: BUTTON_SIZE, ...SHADOW }}
          accessibilityLabel={`인증 사진 ${taken + i + 1} 미촬영`}
        >
          <SemosanMarkIcon width={22} color={colors.label["subtler-inverse"]} />
        </View>
      ))}
    </View>
  );
}
