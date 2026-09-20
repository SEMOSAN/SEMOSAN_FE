import { CameraIcon } from "@/components/icons/camera-icon";
import { MountainPeaksIcon } from "@/components/icons/mountain-peaks-icon";
import { colors } from "@/constants/colors";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SHADOW } from "../constants";

/** 우측 레일이 시작하는 화면 y — 상단 사진 배너(top 124) 아래 */
export const TRACKING_RAIL_TOP = 240;
/** 인증 사진 슬롯 수. 4번째(정상) 사진은 정상 시트에서 따로 다룬다 */
const PHOTO_SLOT_COUNT = 3;
const BUTTON_SIZE = 48;

type Props = {
  isPhotoWindowOpen: boolean;
  photosTaken: number;
  showTooltip: boolean;
  onDismissTooltip: () => void;
  onCameraPress: () => void;
};

/** 트래킹 중 우측 레일 — 카메라 버튼 + 인증 사진 슬롯 */
export function TrackingRail({
  isPhotoWindowOpen,
  photosTaken,
  showTooltip,
  onDismissTooltip,
  onCameraPress,
}: Props) {
  const filled = Math.min(photosTaken, PHOTO_SLOT_COUNT);

  return (
    <View className="absolute right-4 gap-2" style={{ top: TRACKING_RAIL_TOP }}>
      {/* 말풍선 툴팁 — 카메라 버튼 왼쪽 */}
      {isPhotoWindowOpen || showTooltip ? (
        <View
          className="absolute flex-row items-center"
          style={{ right: BUTTON_SIZE + 4, top: 0, height: BUTTON_SIZE }}
        >
          <View className="flex-row items-center gap-2 rounded-[10px] bg-fill-heavy px-4 py-2">
            <Text
              className="text-common-100 typo-caption-1-medium"
              numberOfLines={1}
            >
              {isPhotoWindowOpen
                ? "사진 기록을 남겨보세요!"
                : "1/4 지점마다 카메라가 활성화돼요!"}
            </Text>
            <TouchableOpacity onPress={onDismissTooltip} hitSlop={8}>
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path
                  d="M12.85 12.15a.5.5 0 0 1-.7.7L8 8.71l-4.15 4.14a.5.5 0 0 1-.7-.7L7.29 8 3.15 3.85a.5.5 0 0 1 .7-.7L8 7.29l4.15-4.14a.5.5 0 0 1 .7.7L8.71 8l4.14 4.15Z"
                  fill={colors.common[100]}
                />
              </Svg>
            </TouchableOpacity>
          </View>
          <Svg
            width={8}
            height={14}
            viewBox="0 0 8 14"
            style={{ marginLeft: -1 }}
          >
            <Path d="M0 0L8 7L0 14Z" fill={colors.fill.heavy} />
          </Svg>
        </View>
      ) : null}

      {/* 카메라 */}
      <TouchableOpacity
        className="items-center justify-center rounded-xl bg-fill-normal"
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          opacity: isPhotoWindowOpen ? 1 : 0.4,
          ...SHADOW,
        }}
        onPress={onCameraPress}
        disabled={!isPhotoWindowOpen}
        accessibilityLabel="인증 사진 촬영"
      >
        <CameraIcon />
      </TouchableOpacity>

      {/* 인증 사진 슬롯 — 찍은 만큼 초록으로 채워진다 */}
      {Array.from({ length: PHOTO_SLOT_COUNT }, (_, i) => {
        const isFilled = i < filled;
        return (
          <View
            key={i}
            className="items-center justify-center rounded-xl bg-fill-normal"
            style={{
              width: BUTTON_SIZE,
              height: BUTTON_SIZE,
              opacity: isFilled ? 1 : 0.4,
              ...SHADOW,
            }}
            accessibilityLabel={`인증 사진 ${i + 1} ${isFilled ? "촬영함" : "미촬영"}`}
          >
            <MountainPeaksIcon
              size={24}
              color={isFilled ? colors.secondary.normal : colors.label.disabled}
            />
          </View>
        );
      })}
    </View>
  );
}
