import { MountainMarkerTextBox } from "@/components/map-markers/mountain-marker-textbox";
import { useId } from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  ClipPath,
  Defs,
  G,
  Path,
  Image as SvgImage,
} from "react-native-svg";

const FALLBACK_IMAGE = require("@/assets/photo-thumb-1.jpg");

type Props = {
  name: string;
  visitCount: number;
  imageUri?: string;
  flagColor?: string;
  selected?: boolean;
};

export const VISITED_MARKER_OVERLAY_WIDTH = 88;
export const VISITED_MARKER_OVERLAY_HEIGHT = 52;

const SELECTED_BG = "#464A57";

export function VisitedMarker({
  name,
  visitCount,
  imageUri,
  flagColor = "#00D864",
  selected = false,
}: Props) {
  const clipIdOuter = useId();
  const clipIdInner = useId();

  return (
    <View style={styles.container} collapsable={false}>
      <View style={styles.contentWrap}>
        <View style={styles.imageGroup}>
          <View
            style={[
              styles.flagPole,
              selected && { backgroundColor: SELECTED_BG },
            ]}
          />
          <View
            style={[
              styles.flag,
              { borderLeftColor: selected ? SELECTED_BG : flagColor },
            ]}
          />

          <View style={styles.imageShapeWrap}>
            <Svg width={28} height={25} viewBox="0 0 32 29">
              <Defs>
                <ClipPath id={clipIdOuter}>
                  <Path d="M13.7571 1.26472C14.7408 -0.421574 17.1773 -0.421574 18.161 1.26472L31.567 24.2465C32.5584 25.9459 31.3326 28.0802 29.3651 28.0802H2.55302C0.585586 28.0802 -0.640242 25.946 0.351092 24.2465L13.7571 1.26472Z" />
                </ClipPath>
                <ClipPath id={clipIdInner}>
                  <Path d="M14.719 3.632C15.307 2.624 16.761 2.624 17.349 3.632L28.919 23.466C29.511 24.481 28.779 25.757 27.605 25.757H4.463C3.288 25.757 2.556 24.481 3.149 23.466L14.719 3.632Z" />
                </ClipPath>
              </Defs>

              <Path
                d="M13.7571 1.26472C14.7408 -0.421574 17.1773 -0.421574 18.161 1.26472L31.567 24.2465C32.5584 25.9459 31.3326 28.0802 29.3651 28.0802H2.55302C0.585586 28.0802 -0.640242 25.946 0.351092 24.2465L13.7571 1.26472Z"
                fill={selected ? SELECTED_BG : "#FFFFFF"}
              />

              <G clipPath={`url(#${clipIdInner})`}>
                <SvgImage
                  href={imageUri ? { uri: imageUri } : FALLBACK_IMAGE}
                  x={0}
                  y={0}
                  width={32}
                  height={29}
                  preserveAspectRatio="xMidYMid slice"
                />
              </G>
            </Svg>
          </View>
        </View>

        <View style={styles.textBoxWrap}>
          <MountainMarkerTextBox
            name={name}
            suffix={visitCount}
            nameColor={selected ? "#ffffff" : "#464A57"}
            suffixColor={selected ? "#A4ABC0" : "#BFC4D1"}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imageGroup: {
    position: "absolute",
    top: 0,
    left: -3,
    width: 28,
    height: 36,
    zIndex: 2,
  },
  flagPole: {
    position: "absolute",
    left: 13,
    top: 0,
    width: 1.6,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  flag: {
    position: "absolute",
    top: 0.5,
    left: 14.8,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 4,
    borderLeftWidth: 6.4,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  imageShapeWrap: {
    position: "absolute",
    left: 0,
    top: 11,
    width: 28,
    height: 25,
  },
  imageIcon: {
    position: "absolute",
    top: 0,
    left: 15,
    width: 6,
    height: 9,
    alignItems: "center",
    justifyContent: "center",
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
    paddingRight: 9,
    paddingTop: 2,
    paddingBottom: 2,
    alignSelf: "flex-start",
  },
});
