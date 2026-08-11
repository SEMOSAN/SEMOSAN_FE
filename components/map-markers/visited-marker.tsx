import { MountainMarkerTextBox } from "@/components/map-markers/mountain-marker-textbox";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  Path,
  Rect,
  Image as SvgImage,
} from "react-native-svg";

// 안쪽 사진도 바깥 테두리와 동일한 세모 배너 실루엣으로 클립 (Figma 인셋 버전)
const PHOTO_CLIP_PATH =
  "M11.8889 1.09785C12.739 -0.36595 14.8446 -0.36595 15.6947 1.09785L27.2802 21.0473C28.1369 22.5225 27.0775 24.3751 25.3773 24.3751L2.20631 24.3751C0.506062 24.3751 -0.553295 22.5225 0.303412 21.0473L11.8889 1.09785Z";

const FALLBACK_IMAGE = require("@/assets/photo-thumb-1.jpg");

type Props = {
  name: string;
  visitCount: number;
  imageUri?: string;
  flagColor?: string;
  selected?: boolean;
  onImageLoad?: () => void;
};

export const VISITED_MARKER_OVERLAY_WIDTH = 88;
export const VISITED_MARKER_OVERLAY_HEIGHT = 52;

const SELECTED_BG = "#464A57";

// Figma "Map Marker" 컴포넌트(Visited=True) 벡터 좌표 그대로 사용 — viewBox 0 0 31.111 40 기준
const FLAG_PATH =
  "M1.25 0C1.47517 0 1.68601 0.0601934 1.86849 0.164388L1.87174 0.166016L8.70361 4.11051C9.25912 4.43124 9.25902 5.23339 8.70361 5.5542L2.5 9.13574L2.5 15.4167C2.49994 16.107 1.94032 16.6667 1.25 16.6667C0.559678 16.6667 5.50001e-05 16.107 0 15.4167L0 1.25C0 0.559644 0.559644 0 1.25 0Z";
const PIN_PATH =
  "M12.1341 1.96445C13.6626 -0.65482 17.4485 -0.654816 18.977 1.96446L30.5656 21.8231C32.106 24.4628 30.2012 27.7778 27.1441 27.7778L3.96701 27.7778C0.909913 27.7778 -0.994839 24.4628 0.545543 21.8231L12.1341 1.96445Z";

export function VisitedMarker({
  name,
  visitCount,
  imageUri,
  flagColor = "#00D864",
  selected = false,
  onImageLoad,
}: Props) {
  const clipIdFlag = useId();
  const clipIdPhoto = useId();
  const whiteOrSelected = selected ? SELECTED_BG : "#FFFFFF";

  return (
    <View style={styles.container} collapsable={false}>
      <View style={styles.contentWrap}>
        <View style={styles.imageGroup}>
          <Svg width={28} height={36} viewBox="0 0 31.111 40">
            <Defs>
              <ClipPath id={clipIdFlag}>
                <Rect x={16.944} y={0} width={6.621} height={9.169} />
              </ClipPath>
              <ClipPath id={clipIdPhoto}>
                <Path
                  d={PHOTO_CLIP_PATH}
                  transform="translate(1.764, 13.923)"
                />
              </ClipPath>
            </Defs>

            {/* 깃대 — 흰색(선택 시 다크) */}
            <Path
              d={FLAG_PATH}
              transform="translate(14.445, 0)"
              fill={whiteOrSelected}
            />
            {/* 깃발 — 초록(선택 시 다크), 깃대 상단만 마스킹해 색칠 */}
            <G clipPath={`url(#${clipIdFlag})`}>
              <Path
                d={FLAG_PATH}
                transform="translate(14.445, 0)"
                fill={selected ? SELECTED_BG : flagColor}
              />
            </G>

            {/* 포토 핀 프레임 */}
            <Path
              d={PIN_PATH}
              transform="translate(0, 12.222)"
              fill={whiteOrSelected}
            />
            {/* 산행 사진 — 테두리와 같은 세모 배너 모양으로 클립 */}
            <G clipPath={`url(#${clipIdPhoto})`}>
              <SvgImage
                href={imageUri ? { uri: imageUri } : FALLBACK_IMAGE}
                x={1.764}
                y={13.923}
                width={27.584}
                height={24.375}
                preserveAspectRatio="xMidYMid slice"
                onLoad={onImageLoad}
              />
            </G>
          </Svg>
        </View>

        <View style={styles.textBoxWrap}>
          <MountainMarkerTextBox
            name={name}
            suffix={visitCount}
            nameColor={selected ? "#ffffff" : "#464A57"}
            suffixColor={selected ? "#A4ABC0" : "#BFC4D1"}
            variant="compact"
            style={[
              styles.textBox,
              selected ? { backgroundColor: SELECTED_BG } : undefined,
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: VISITED_MARKER_OVERLAY_WIDTH,
    height: VISITED_MARKER_OVERLAY_HEIGHT,
  },
  contentWrap: {
    position: "absolute",
    left: 8,
    top: 8,
    width: 72,
    height: 36,
    boxShadow: "0px 0.78px 6.26px 0px rgba(0, 0, 0, 0.2)",
  },
  imageGroup: {
    position: "absolute",
    top: 0,
    left: -3,
    width: 28,
    height: 36,
    zIndex: 2,
  },
  textBoxWrap: {
    position: "absolute",
    left: 2,
    bottom: 0,
    zIndex: 1,
  },
  textBox: {
    height: 21,
    borderRadius: 999,
    paddingLeft: 24,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "flex-start",
  },
});
