import { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type Variant = "default" | "compact";

type Props = {
  name: string;
  suffix?: string | number;
  leading?: ReactNode;
  nameColor?: string;
  suffixColor?: string;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

// variant별 간격/타이포그래피 — 호출자가 임의의 숫자를 넘기지 못하도록 컴포넌트 내부에서 토큰으로 고정
const GAP_CLASSNAME: Record<Variant, string> = {
  default: "gap-1",
  compact: "gap-0.5",
};

// default는 디자인 토큰(typo-caption-1-semi-bold, 12px/line-height 1.3)을 그대로 사용.
// compact(다녀온 산 마커, Figma 10px/13px 스펙)는 대응하는 typo 토큰이 아직 없어 폰트 크기만 예외적으로 인라인 처리.
const TEXT_CLASSNAME: Record<Variant, string | undefined> = {
  default: "typo-caption-1-semi-bold",
  compact: undefined,
};
const COMPACT_TEXT_STYLE = {
  fontSize: 10,
  lineHeight: 13,
  fontWeight: "600" as const,
};

export function MountainMarkerTextBox({
  name,
  suffix,
  leading,
  nameColor = "#464A57",
  suffixColor = "#BFC4D1",
  variant = "default",
  style,
}: Props) {
  const textClassName = TEXT_CLASSNAME[variant];
  const textStyle = variant === "compact" ? COMPACT_TEXT_STYLE : undefined;

  return (
    <View className={GAP_CLASSNAME[variant]} style={[styles.container, style]}>
      {leading}
      <Text
        className={textClassName}
        style={[styles.text, textStyle, { color: nameColor }]}
        numberOfLines={1}
      >
        {name}
      </Text>
      {suffix !== undefined && suffix !== null ? (
        <Text
          className={textClassName}
          style={[styles.text, textStyle, { color: suffixColor }]}
          numberOfLines={1}
        >
          {suffix}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});
